package com.project.credflow.service.inter;

import com.project.credflow.model.DunningRule;
import com.project.credflow.model.Invoice;

public interface RuleConditionService {
    boolean checkCondition(DunningRule rule, Invoice invoice);
}