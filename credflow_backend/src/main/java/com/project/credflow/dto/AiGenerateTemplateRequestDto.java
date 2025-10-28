package com.project.credflow.dto;

import com.project.credflow.enums.Channel; // Import Channel enum
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AiGenerateTemplateRequestDto {

    @NotNull(message = "Channel (EMAIL or SMS) is required")
    private Channel channel;

    @NotBlank(message = "Purpose of the template is required")
    @Size(min = 10, max = 500, message = "Purpose must be between 10 and 500 characters")
    private String purpose;

    @Size(max = 100, message = "Tone cannot exceed 100 characters")
    private String tone;

    @Size(max = 500, message = "Key details cannot exceed 500 characters")
    private String keyDetails;

}