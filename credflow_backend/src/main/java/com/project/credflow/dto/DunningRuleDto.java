package com.project.credflow.dto;

import com.project.credflow.enums.*; // Import enums package
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DunningRuleDto {

    private UUID ruleId;

    @NotBlank(message = "Rule name cannot be blank")
    @Size(max = 100, message = "Rule name cannot exceed 100 characters")
    private String ruleName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotNull(message = "Priority is required")
    @Min(value = 1, message = "Priority must be at least 1")
    private Integer priority;

    @NotNull(message = "Active status is required")
    private Boolean isActive;

    private PlanType appliesToPlanType;

    @NotNull(message = "Condition type is required")
    private RuleConditionType conditionType;

    private Integer conditionValueInteger;
    private BigDecimal conditionValueDecimal;
    private String conditionValueString;

    @NotNull(message = "Action type is required")
    private RuleActionType actionType;

    private UUID templateId;
    private String templateName;
    private BpoTaskPriority bpoTaskPriority;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}