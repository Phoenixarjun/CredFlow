package com.project.credflow.service.impl;

import com.project.credflow.enums.InvoiceStatus;
import com.project.credflow.enums.PlanType;
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

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DunningEngineServiceImpl implements DunningEngineService {

    private static final Logger log = LoggerFactory.getLogger(DunningEngineServiceImpl.class);

    private final InvoiceRepository invoiceRepository;
    private final DunningRuleRepository dunningRuleRepository;
    private final DunningExecutionLogRepository logRepository;
    private final RuleConditionService ruleConditionService;
    private final RuleActionService ruleActionService;
    private final DunningEngineRunRepository dunningEngineRunRepository;

    private PlanType getPlanTypeFromInvoice(Invoice invoice) {
        if (invoice.getAccount() != null &&
                invoice.getAccount().getPlan() != null &&
                invoice.getAccount().getPlan().getPlanType() != null) {
            PlanType type = invoice.getAccount().getPlan().getPlanType();
            // Important: Treat ALL on an actual plan as undefined for matching rules
            return (type == PlanType.ALL) ? null : type;
        }
        log.warn("Could not determine PlanType for Invoice {}. Account or Plan missing.", invoice.getInvoiceId());
        return null;
    }

    @Scheduled(cron = "0 0 1 * * ?") // 1 AM daily
    @Override
    @Transactional
    public void runDunningProcess() {
        log.info("Starting scheduled dunning process...");

        DunningEngineRun engineRun = new DunningEngineRun();
        engineRun.setStartTime(LocalDateTime.now());
        engineRun = dunningEngineRunRepository.save(engineRun);

        List<Invoice> overdueInvoices = invoiceRepository.findByStatus(InvoiceStatus.OVERDUE);
        log.info("Found {} overdue invoices.", overdueInvoices.size());

        List<DunningRule> activeRules = dunningRuleRepository.findByIsActiveTrueOrderByPriorityAsc();
        log.info("Found {} active dunning rules.", activeRules.size());

        if (overdueInvoices.isEmpty() || activeRules.isEmpty()) {
            log.info("No invoices or rules to process. Dunning process finished.");
            // engineRun.setEndTime(LocalDateTime.now());
            // dunningEngineRunRepository.save(engineRun);
            return;
        }

        int actionsExecuted = 0;

        for (Invoice invoice : overdueInvoices) {
            log.debug("Processing Invoice: {}", invoice.getInvoiceNumber());
            PlanType invoicePlanType = getPlanTypeFromInvoice(invoice);

            for (DunningRule rule : activeRules) {
                PlanType ruleAppliesTo = rule.getAppliesToPlanType();

                // Skip rule if rule is specific (not ALL) AND (invoice type is unknown OR invoice type doesn't match)
                if (ruleAppliesTo != null && ruleAppliesTo != PlanType.ALL) {
                    if (invoicePlanType == null || ruleAppliesTo != invoicePlanType) {
                        log.trace("Skipping Rule '{}': PlanType mismatch (Rule applies to {}, Invoice is {}).",
                                rule.getRuleName(), ruleAppliesTo, invoicePlanType);
                        continue;
                    }
                }

                boolean conditionMet = ruleConditionService.checkCondition(rule, invoice);
                if (!conditionMet) {
                    log.trace("Skipping Rule '{}': Condition not met for Invoice '{}'.", rule.getRuleName(), invoice.getInvoiceNumber());
                    continue;
                }

                boolean alreadyExecuted = logRepository.existsByDunningRule_RuleIdAndInvoice_InvoiceId(
                        rule.getRuleId(), invoice.getInvoiceId());

                if (!alreadyExecuted) {
                    log.info("MATCH: Rule '{}' ({}) matches Invoice '{}' (PlanType: {}). Executing action...",
                            rule.getRuleName(), rule.getRuleId(), invoice.getInvoiceNumber(), invoicePlanType);
                    try {
                        ruleActionService.executeAction(rule, invoice);
                        DunningExecutionLog executionLog = new DunningExecutionLog(rule, invoice);
                        logRepository.save(executionLog);
                        actionsExecuted++;
                        log.info("Action executed and logged for Rule '{}' on Invoice '{}'. Moving to next invoice.",
                                rule.getRuleName(), invoice.getInvoiceNumber());
                        break;
                    } catch (Exception e) {
                        log.error("Failed to execute action for Rule {} ({}) on Invoice {}: {}",
                                rule.getRuleId(), rule.getRuleName(), invoice.getInvoiceId(), e.getMessage(), e);
                        break;
                    }
                } else {
                    log.trace("Skipping Rule '{}': Already executed for Invoice '{}'.", rule.getRuleName(), invoice.getInvoiceNumber());
                }
            } // End rule loop
        } // End invoice loop

        log.info("Scheduled dunning process finished. Total actions executed: {}", actionsExecuted);
        // engineRun.setEndTime(LocalDateTime.now());
        // dunningEngineRunRepository.save(engineRun);
    }
}