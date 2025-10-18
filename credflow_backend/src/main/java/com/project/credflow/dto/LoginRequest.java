package com.project.credflow.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
