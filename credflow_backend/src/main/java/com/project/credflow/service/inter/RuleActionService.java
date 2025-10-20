package com.project.credflow.service.inter;

import com.project.credflow.model.DunningRule;
import com.project.credflow.model.Invoice;

public interface RuleActionService {
    void executeAction(DunningRule rule, Invoice invoice);
}