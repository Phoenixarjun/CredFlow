package com.project.credflow.dto;

import com.project.credflow.enums.Channel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID; // Keep for internal use if needed, but DTO uses String

@Data
public class NotificationTemplateDto {

    // Keep as String for frontend compatibility (even if BINARY(16) in DB)
    private String templateId;

    @NotBlank(message = "Template name cannot be blank")
    private String templateName;

    @NotNull(message = "Channel cannot be null")
    private Channel channel;

    @NotBlank(message = "Subject cannot be blank")
    private String subject;

    @NotBlank(message = "Body cannot be blank")
    private String body;

    // Use String for the User ID in the DTO
    private String createdByUserId; // <-- CHANGED TO String

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}