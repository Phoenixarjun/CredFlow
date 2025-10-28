package com.project.credflow.service.impl;

import com.project.credflow.enums.InvoiceStatus; // <-- Import InvoiceStatus
import com.project.credflow.enums.RuleConditionType; // <-- Import RuleConditionType
import com.project.credflow.model.DunningRule;
import com.project.credflow.model.Invoice;
import com.project.credflow.service.inter.RuleConditionService;
import org.springframework.stereotype.Service;
import org.slf4j.Logger; // <-- Import Logger
import org.slf4j.LoggerFactory; // <-- Import LoggerFactory

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class RuleConditionServiceImpl implements RuleConditionService {

    private static final Logger log = LoggerFactory.getLogger(RuleConditionServiceImpl.class);

    @Override
    public boolean checkCondition(DunningRule rule, Invoice invoice) {
        if (rule == null || invoice == null || rule.getConditionType() == null) {
            log.warn("checkCondition returning false due to null rule, invoice, or condition type.");
            return false;
        }

        switch (rule.getConditionType()) {
            case DAYS_OVERDUE:
                // This condition only makes sense for OVERDUE invoices
                if (invoice.getStatus() != InvoiceStatus.OVERDUE) {
                    log.trace("Skipping DAYS_OVERDUE check for non-overdue invoice {}", invoice.getInvoiceNumber());
                    return false;
                }
                if (rule.getConditionValueInteger() == null || invoice.getDueDate() == null) {
                    log.warn("DAYS_OVERDUE condition value or invoice due date is null for rule {} / invoice {}", rule.getRuleId(), invoice.getInvoiceId());
                    return false;
                }
                long daysOverdue = ChronoUnit.DAYS.between(invoice.getDueDate(), LocalDate.now());
                // Condition: Actual days overdue is GREATER THAN OR EQUAL TO the value
                // Example: Rule value 7 triggers on day 7, 8, etc.
                boolean overdueMet = daysOverdue >= rule.getConditionValueInteger();
                log.trace("DAYS_OVERDUE check for rule {} / invoice {}: daysOverdue={}, ruleValue={}, met={}",
                        rule.getRuleId(), invoice.getInvoiceId(), daysOverdue, rule.getConditionValueInteger(), overdueMet);
                return overdueMet;

            case DAYS_UNTIL_DUE:
                // This condition primarily makes sense for PENDING invoices (Prepaid Reminders)
                if (invoice.getStatus() != InvoiceStatus.PENDING) {
                    log.trace("Skipping DAYS_UNTIL_DUE check for non-pending invoice {}", invoice.getInvoiceNumber());
                    return false;
                }
                if (rule.getConditionValueInteger() == null || invoice.getDueDate() == null) {
                    log.warn("DAYS_UNTIL_DUE condition value or invoice due date is null for rule {} / invoice {}", rule.getRuleId(), invoice.getInvoiceId());
                    return false;
                }
                long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), invoice.getDueDate());
                // Condition: Actual days until due is LESS THAN OR EQUAL TO the value
                // Example: Rule value 1 triggers on day 1 (tomorrow) or day 0 (today)
                boolean untilMet = daysUntil <= rule.getConditionValueInteger();
                log.trace("DAYS_UNTIL_DUE check for rule {} / invoice {}: daysUntil={}, ruleValue={}, met={}",
                        rule.getRuleId(), invoice.getInvoiceId(), daysUntil, rule.getConditionValueInteger(), untilMet);
                return untilMet;

            case MIN_AMOUNT_DUE:
                if (rule.getConditionValueDecimal() == null || invoice.getAmountDue() == null) {
                    log.warn("MIN_AMOUNT_DUE condition value or invoice amount due is null for rule {} / invoice {}", rule.getRuleId(), invoice.getInvoiceId());
                    return false;
                }
                // compareTo returns 0 if equal, >0 if greater, <0 if less
                boolean minAmountMet = invoice.getAmountDue().compareTo(rule.getConditionValueDecimal()) >= 0;
                log.trace("MIN_AMOUNT_DUE check for rule {} / invoice {}: amountDue={}, ruleValue={}, met={}",
                        rule.getRuleId(), invoice.getInvoiceId(), invoice.getAmountDue(), rule.getConditionValueDecimal(), minAmountMet);
                return minAmountMet;

            case ACCOUNT_TYPE:
                // This condition can apply to any invoice with an account
                if (rule.getConditionValueString() == null || rule.getConditionValueString().isEmpty()) {
                    log.warn("ACCOUNT_TYPE condition value string is null/empty for rule {}", rule.getRuleId());
                    return false;
                }
                if (invoice.getAccount() == null || invoice.getAccount().getAccountType() == null) {
                    log.trace("Skipping ACCOUNT_TYPE check for invoice {} - account or account type missing.", invoice.getInvoiceNumber());
                    return false; // Cannot check if account/type is missing
                }
                boolean typeMet = invoice.getAccount().getAccountType().name().equalsIgnoreCase(rule.getConditionValueString());
                log.trace("ACCOUNT_TYPE check for rule {} / invoice {}: accountType={}, ruleValue={}, met={}",
                        rule.getRuleId(), invoice.getInvoiceId(), invoice.getAccount().getAccountType().name(), rule.getConditionValueString(), typeMet);
                return typeMet;

            default:
                log.warn("Unhandled condition type {} for rule {}", rule.getConditionType(), rule.getRuleId());
                return false;
        }
    }
}