package com.project.credflow.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private String userId;
    // NO 'username' field
    private String email;
    private String fullName;
    private String phoneNumber;
    private String roleName;
    private LocalDateTime createdAt;
    private Boolean isActive; // Field name matches your User model
}