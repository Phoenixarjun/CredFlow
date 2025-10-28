package com.project.credflow.dto;

import com.project.credflow.enums.Channel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

// DTO for Create/Update operations
@Data
public class NotificationTemplateRequestDto {

    @NotBlank(message = "Template name cannot be blank")
    @Size(max = 100, message = "Template name cannot exceed 100 characters")
    private String templateName;

    @NotNull(message = "Channel cannot be null")
    private Channel channel; // Expecting EMAIL, SMS, etc.

    // Subject might be optional for non-EMAIL channels, adjust validation if needed
    @NotBlank(message = "Subject cannot be blank") // Keep for now
    @Size(max = 255, message = "Subject cannot exceed 255 characters")
    private String subject;

    @NotBlank(message = "Body cannot be blank")
    private String body; // Field for template content
}