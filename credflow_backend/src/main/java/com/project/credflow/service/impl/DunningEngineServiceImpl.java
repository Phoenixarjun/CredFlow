package com.project.credflow.service.impl;

import com.project.credflow.enums.InvoiceStatus;
import com.project.credflow.model.DunningExecutionLog;
import com.project.credflow.model.DunningRule;
import com.project.credflow.model.Invoice;
import com.project.credflow.repository.DunningExecutionLogRepository;
import com.project.credflow.repository.DunningRuleRepository;
import com.project.credflow.repository.InvoiceRepository;
import com.project.credflow.service.inter.DunningEngineService;
import com.project.credflow.service.inter.RuleActionService;
import com.project.credflow.service.inter.RuleConditionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DunningEngineServiceImpl implements DunningEngineService {

    private static final Logger log = LoggerFactory.getLogger(DunningEngineServiceImpl.class);

    // Inject all required services and repositories
    private final InvoiceRepository invoiceRepository;
    private final DunningRuleRepository dunningRuleRepository;
    private final DunningExecutionLogRepository logRepository;
    private final RuleConditionService ruleConditionService;
    private final RuleActionService ruleActionService;


    @Scheduled(cron = "0 0 1 * * ?") // 1 AM daily
    @Override
    @Transactional // Run the whole process in a transaction
    public void runDunningProcess() {
        log.info("Starting scheduled dunning process...");

        // 1. Fetch all 'OVERDUE' invoices. (Ensure you have this method in InvoiceRepository)
        // Let's assume you need to create this method in InvoiceRepository:
        // List<Invoice> findByStatus(String status);
        List<Invoice> overdueInvoices = invoiceRepository.findByStatus(InvoiceStatus.OVERDUE);
        log.info("Found {} overdue invoices.", overdueInvoices.size());

        // 2. Fetch all 'active' dunning rules, ordered by priority.
        // Create this method in DunningRuleRepository:
        // List<DunningRule> findByIsActiveTrueOrderByPriorityAsc();
        List<DunningRule> activeRules = dunningRuleRepository.findByIsActiveTrueOrderByPriorityAsc();
        log.info("Found {} active dunning rules.", activeRules.size());

        if (overdueInvoices.isEmpty() || activeRules.isEmpty()) {
            log.info("No invoices or rules to process. Dunning process finished.");
            return;
        }

        int actionsExecuted = 0;

        // 3. Loop through each invoice.
        for (Invoice invoice : overdueInvoices) {

            // 4. For each invoice, loop through rules (which are already sorted by priority).
            for (DunningRule rule : activeRules) {

                // 5. Check if a rule's condition is met.
                boolean conditionMet = ruleConditionService.checkCondition(rule, invoice);
                if (!conditionMet) {
                    continue; // Condition not met, try next rule
                }

                // 6. Check if rule has ALREADY run for this invoice.
                boolean alreadyExecuted = logRepository.existsByDunningRule_RuleIdAndInvoice_InvoiceId(
                        rule.getRuleId(), invoice.getInvoiceId());

                // 7. If (condition is met AND not already executed):
                if (!alreadyExecuted) {
                    log.info("MATCH: Rule '{}' matches invoice '{}'. Executing action...",
                            rule.getRuleName(), invoice.getInvoiceNumber());

                    try {
                        // a. Execute the rule's action (e.g., send email).
                        ruleActionService.executeAction(rule, invoice);

                        // b. Log the execution.
                        DunningExecutionLog executionLog = new DunningExecutionLog(rule, invoice);
                        logRepository.save(executionLog);

                        actionsExecuted++;

                        // c. Break from rule loop (only one rule per invoice per day).
                        log.info("Action executed and logged. Moving to next invoice.");
                        break;

                    } catch (Exception e) {
                        // Log error but continue to the next invoice
                        log.error("Failed to execute action for rule {} on invoice {}: {}",
                                rule.getRuleId(), invoice.getInvoiceId(), e.getMessage(), e);
                    }
                }
            } // End rule loop
        } // End invoice loop

        log.info("Scheduled dunning process finished. Total actions executed: {}", actionsExecuted);
    }
}