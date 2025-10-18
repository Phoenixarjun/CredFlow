package com.project.credflow.service.inter;

import com.project.credflow.dto.AuthResponse;
import com.project.credflow.dto.LoginRequest;
import com.project.credflow.dto.RegisterRequest;
import com.project.credflow.dto.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    UserDto getMyProfile();
}