package com.project.credflow.dto;

import com.project.credflow.enums.AccountType;
import com.project.credflow.enums.PlanType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PlanDto {
    private UUID planId;
    private String planName;
    private AccountType type;
    private PlanType planType;
    private String defaultSpeed;
    private BigDecimal price;
    private boolean isActive;
}