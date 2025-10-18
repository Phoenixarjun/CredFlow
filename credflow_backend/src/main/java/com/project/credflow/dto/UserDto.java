package com.project.credflow.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserDto {
    private UUID userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String roleName;
}