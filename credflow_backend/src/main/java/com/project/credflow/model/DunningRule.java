package com.project.credflow.model;

import com.project.credflow.enums.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "dunning_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DunningRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    // Assuming your DB uses binary(16) for UUIDs. If not, remove columnDefinition.
    @Column(name = "rule_id", columnDefinition = "binary(16)")
    private UUID ruleId;

    @Column(name = "rule_name", nullable = false, unique = true, length = 100)
    private String ruleName;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "priority", nullable = false)
    private Integer priority;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "applies_to_plan_type") // e.g., PREPAID, POSTPAID, ALL
    private PlanType appliesToPlanType;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_type", nullable = false) // e.g., DAYS_OVERDUE, DAYS_UNTIL_DUE
    private RuleConditionType conditionType;

    @Column(name = "condition_value_integer") // Used for DAYS_OVERDUE, DAYS_UNTIL_DUE
    private Integer conditionValueInteger;

    @Column(name = "condition_value_decimal", precision = 19, scale = 2) // Used for MIN_AMOUNT_DUE
    private BigDecimal conditionValueDecimal;

    @Column(name = "condition_value_string", length = 50)
    private String conditionValueString;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private RuleActionType actionType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "template_id", referencedColumnName = "template_id") // Links to NotificationTemplate
    private NotificationTemplate template;
    // -----------------------------------------------------------

    @Enumerated(EnumType.STRING)
    @Column(name = "bpo_task_priority")
    private BpoTaskPriority bpoTaskPriority;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}