package com.project.credflow.dto;

import com.project.credflow.enums.NotificationChannel;
import com.project.credflow.enums.NotificationStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class NotificationLogDto {
    private UUID logId;
    private NotificationChannel channel;
    private String templateName;
    private NotificationStatus status;
    private String failureReason;
    private LocalDateTime sentAt;
}