package com.project.credflow.repository;

import com.project.credflow.model.DunningRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DunningRuleRepository extends JpaRepository<DunningRule, UUID> {

    List<DunningRule> findByIsActiveTrueOrderByPriorityAsc();

    Optional<DunningRule> findByRuleName(String ruleName);

    // You might add more specific finders later if needed, e.g.:
    // List<DunningRule> findByConditionTypeAndIsActiveTrueOrderByPriorityAsc(RuleConditionType conditionType);
}