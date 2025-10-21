package com.project.credflow.dto;

import com.project.credflow.enums.BpoTaskPriority;
import com.project.credflow.enums.BpoTaskStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BpoTaskDto {
    private String taskId;
    private String customerId;
    private String customerName;
    private String invoiceId;
    private String invoiceNumber;
    private String assignedToId;
    private String assignedToName;
    private BpoTaskStatus status;
    private BpoTaskPriority priority;
    private String taskDescription;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}