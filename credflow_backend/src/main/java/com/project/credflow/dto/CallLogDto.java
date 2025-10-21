package com.project.credflow.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CallLogDto {
    private String logId;
    private String taskId;
    private String agentId;
    private String agentName;
    private String callOutcome;
    private String notes;
    private LocalDateTime createdAt;
}