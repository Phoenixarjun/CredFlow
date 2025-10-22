package com.project.credflow.dto;

import com.project.credflow.enums.AccountStatus;
import com.project.credflow.enums.AccountType;
import com.project.credflow.enums.PlanType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class AccountDto {
    private UUID accountId;
    private String accountNumber;
    private AccountType accountType;
    private AccountStatus status;
    private BigDecimal currentBalance;
    private String planName;
    private String currentSpeed;
    private PlanType planType;
}