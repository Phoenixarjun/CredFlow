package com.project.credflow.dto;

import com.project.credflow.enums.RoleName;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private RoleName roleName;
}