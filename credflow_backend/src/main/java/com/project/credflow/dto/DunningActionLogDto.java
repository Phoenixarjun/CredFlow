package com.project.credflow.dto;

import com.project.credflow.enums.RuleActionType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DunningActionLogDto {
    private UUID logId;
    private RuleActionType actionType;
    private UUID invoiceId;
    private LocalDateTime createdAt;
}