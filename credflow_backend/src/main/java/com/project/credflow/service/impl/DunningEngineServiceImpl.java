package com.project.credflow.service.impl;

import com.project.credflow.enums.InvoiceStatus;
import com.project.credflow.enums.PlanType;
import com.project.credflow.enums.RuleConditionType; // <-- Import
import com.project.credflow.model.*;
import com.project.credflow.repository.*;
import com.project.credflow.service.inter.DunningEngineService;
import com.project.credflow.service.inter.RuleActionService;
import com.project.credflow.service.inter.RuleConditionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate; // <-- Import LocalDate
import java.time.LocalDateTime;
import java.util.ArrayList; // <-- Import ArrayList
import java.util.List;
import java.util.stream.Collectors; // <-- Import Collectors
import java.util.stream.Stream; // <-- Import Stream

@Service
@RequiredArgsConstructor
public class DunningEngineServiceImpl implements DunningEngineService {

    private static final Logger log = LoggerFactory.getLogger(DunningEngineServiceImpl.class);
    // Max days BEFORE due date to check for prepaid reminders
    private static final int PREPAID_REMINDER_LOOKAHEAD_DAYS = 10; // Check invoices due in the next 10 days

    private final InvoiceRepository invoiceRepository;
    private final DunningRuleRepository dunningRuleRepository;
    private final DunningExecutionLogRepository logRepository;
    private final RuleConditionService ruleConditionService;
    private final RuleActionService ruleActionService;
    private final DunningEngineRunRepository dunningEngineRunRepository;

    // --- Refined getPlanTypeFromInvoice ---
    private PlanType getPlanTypeFromInvoice(Invoice invoice) {
        // Returns the actual PlanType (PREPAID/POSTPAID) or null if not determinable
        try {
            return invoice.getAccount().getPlan().getPlanType();
        } catch (NullPointerException e) {
            log.warn("Could not determine PlanType for Invoice {}. Account, Plan, or PlanType missing.", invoice.getInvoiceId());
            return null;
        }
    }
    // ------------------------------------

    @Scheduled(cron = "0 0 1 * * ?") // 1 AM daily
    // @Scheduled(cron = "0 * * * * ?") // Every minute for testing
    @Override
    @Transactional
    public void runDunningProcess() {
        log.info("Starting scheduled dunning process...");

        DunningEngineRun engineRun = new DunningEngineRun();
        engineRun.setStartTime(LocalDateTime.now());
        engineRun = dunningEngineRunRepository.save(engineRun); // Save initially to get ID

        List<DunningRule> activeRules = dunningRuleRepository.findByIsActiveTrueOrderByPriorityAsc();
        log.info("Found {} active dunning rules.", activeRules.size());

        if (activeRules.isEmpty()) {
            log.info("No active rules found. Dunning process finished.");
            engineRun.setEndTime(LocalDateTime.now());
            dunningEngineRunRepository.save(engineRun);
            return;
        }

        // --- Fetch BOTH overdue and upcoming prepaid invoices ---
        List<Invoice> overdueInvoices = invoiceRepository.findByStatus(InvoiceStatus.OVERDUE);
        log.info("Found {} OVERDUE invoices.", overdueInvoices.size());

        LocalDate lookaheadDate = LocalDate.now().plusDays(PREPAID_REMINDER_LOOKAHEAD_DAYS);
        List<Invoice> upcomingPrepaidInvoices = invoiceRepository.findPendingPrepaidInvoicesDueBefore(lookaheadDate);
        log.info("Found {} PENDING PREPAID invoices due on or before {}.", upcomingPrepaidInvoices.size(), lookaheadDate);

        // Combine lists for processing
        List<Invoice> invoicesToProcess = Stream.concat(overdueInvoices.stream(), upcomingPrepaidInvoices.stream())
                .distinct() // Avoid duplicates if an invoice somehow matches both
                .collect(Collectors.toList());

        if (invoicesToProcess.isEmpty()) {
            log.info("No relevant invoices found to process. Dunning process finished.");
            engineRun.setEndTime(LocalDateTime.now());
            dunningEngineRunRepository.save(engineRun);
            return;
        }
        // ----------------------------------------------------

        int actionsExecuted = 0;

        for (Invoice invoice : invoicesToProcess) {
            log.debug("Processing Invoice: {} (Status: {}, Due: {})", invoice.getInvoiceNumber(), invoice.getStatus(), invoice.getDueDate());
            PlanType invoicePlanType = getPlanTypeFromInvoice(invoice); // PREPAID, POSTPAID, or null

            for (DunningRule rule : activeRules) {
                PlanType ruleAppliesTo = rule.getAppliesToPlanType(); // PREPAID, POSTPAID, or ALL

                // --- Rule Applicability Checks ---
                // 1. Plan Type Check: Skip if rule is specific and doesn't match invoice type
                if (ruleAppliesTo != PlanType.ALL && ruleAppliesTo != invoicePlanType) {
                    log.trace("Skipping Rule '{}': PlanType mismatch (Rule: {}, Invoice: {}).",
                            rule.getRuleName(), ruleAppliesTo, invoicePlanType);
                    continue;
                }

                // 2. Condition Type vs Invoice Status Check: Skip inapplicable conditions
                RuleConditionType conditionType = rule.getConditionType();
                InvoiceStatus invoiceStatus = invoice.getStatus();

                if (conditionType == RuleConditionType.DAYS_OVERDUE && invoiceStatus != InvoiceStatus.OVERDUE) {
                    log.trace("Skipping Rule '{}' ({}): Condition applies only to OVERDUE invoices.", rule.getRuleName(), conditionType);
                    continue;
                }
                if (conditionType == RuleConditionType.DAYS_UNTIL_DUE && invoiceStatus != InvoiceStatus.PENDING) {
                    log.trace("Skipping Rule '{}' ({}): Condition applies primarily to PENDING invoices.", rule.getRuleName(), conditionType);
                    continue; // Skip if checking 'until due' on an already overdue/paid invoice
                }
                // (MIN_AMOUNT_DUE and ACCOUNT_TYPE can apply regardless of status)
                // --------------------------------

                log.trace("Evaluating Rule '{}' for Invoice '{}'", rule.getRuleName(), invoice.getInvoiceNumber());
                boolean conditionMet = ruleConditionService.checkCondition(rule, invoice);

                if (!conditionMet) {
                    log.trace("Condition NOT MET for Rule '{}' on Invoice '{}'.", rule.getRuleName(), invoice.getInvoiceNumber());
                    continue; // Condition not met, try next rule
                }

                log.debug("Condition MET for Rule '{}' on Invoice '{}'. Checking execution status...", rule.getRuleName(), invoice.getInvoiceNumber());
                boolean alreadyExecuted = logRepository.existsByDunningRule_RuleIdAndInvoice_InvoiceId(
                        rule.getRuleId(), invoice.getInvoiceId());

                if (!alreadyExecuted) {
                    log.info("MATCH: Rule '{}' matches Invoice '{}'. Executing action '{}'...",
                            rule.getRuleName(), invoice.getInvoiceNumber(), rule.getActionType());
                    try {
                        ruleActionService.executeAction(rule, invoice);
                        DunningExecutionLog executionLog = new DunningExecutionLog(rule, invoice);
                        logRepository.save(executionLog);
                        actionsExecuted++;
                        log.info("Action executed and logged for Rule '{}' on Invoice '{}'. Moving to next invoice.",
                                rule.getRuleName(), invoice.getInvoiceNumber());
                        break; // Stop processing rules for this invoice once one has executed
                    } catch (Exception e) {
                        log.error("Failed to execute action for Rule '{}' on Invoice {}: {}",
                                rule.getRuleName(), invoice.getInvoiceNumber(), e.getMessage(), e);
                        // Optional: Log failure specifically? Maybe don't break? Depends on desired behavior.
                        // For now, we break even on failure to avoid potential loops/repeated errors on the same invoice in one run.
                        break;
                    }
                } else {
                    log.trace("Skipping Rule '{}': Already executed for Invoice '{}'.", rule.getRuleName(), invoice.getInvoiceNumber());
                    // Don't break here, let lower priority rules be checked if needed (though unlikely with current break logic)
                }
            } // End rule loop
        } // End invoice loop

        log.info("Scheduled dunning process finished. Total actions executed: {}", actionsExecuted);
        engineRun.setEndTime(LocalDateTime.now());
        dunningEngineRunRepository.save(engineRun); // Save final end time
    }
}