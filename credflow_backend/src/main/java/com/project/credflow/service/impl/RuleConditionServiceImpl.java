package com.project.credflow.service.impl;

import com.project.credflow.model.DunningRule;
import com.project.credflow.model.Invoice;
import com.project.credflow.service.inter.RuleConditionService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class RuleConditionServiceImpl implements RuleConditionService {

    @Override
    public boolean checkCondition(DunningRule rule, Invoice invoice) {
        if (rule == null || invoice == null || rule.getConditionType() == null) {
            return false;
        }

        switch (rule.getConditionType()) {
            case DAYS_OVERDUE:
                if (rule.getConditionValueInteger() == null) return false;

                // Calculate days overdue
                long daysOverdue = ChronoUnit.DAYS.between(invoice.getDueDate(), LocalDate.now());

                // Check if days overdue is greater than the rule's value
                return daysOverdue > rule.getConditionValueInteger();

            case MIN_AMOUNT_DUE:
                if (rule.getConditionValueDecimal() == null) return false;

                // Check if invoice amount is greater than or equal to the rule's value
                // compareTo returns 0 if equal, 1 if greater, -1 if less
                return invoice.getAmountDue().compareTo(rule.getConditionValueDecimal()) >= 0;

            case ACCOUNT_TYPE:
                if (rule.getConditionValueString() == null || rule.getConditionValueString().isEmpty()) return false;
                if (invoice.getAccount() == null || invoice.getAccount().getAccountType() == null) return false;

                // Check if the account's type (as a string) equals the rule's value
                return invoice.getAccount().getAccountType().name().equals(rule.getConditionValueString());

            default:
                return false;
        }
    }
}