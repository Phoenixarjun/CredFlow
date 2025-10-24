package com.project.credflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ManualCureRequestDto {
    @NotBlank(message = "Reason for manual cure is required")
    private String reason;
}