package com.project.credflow.controller;

import com.project.credflow.dto.AuthResponse;
import com.project.credflow.dto.LoginRequest;
import com.project.credflow.dto.RegisterRequest;
import com.project.credflow.service.inter.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping; // <-- ADD THIS
import com.project.credflow.dto.UserDto;
/**
 * Uses Constructor Injection (@RequiredArgsConstructor) instead of @Autowired for:
 * ✅ Immutability & null safety (final fields)
 * ✅ Easier testing (no Spring context needed)
 * ✅ Clear, explicit dependencies
 * ✅ Modern Spring best practice with less boilerplate
 */



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getMyProfile() {
        UserDto userDto = authService.getMyProfile();
        return ResponseEntity.ok(userDto);
    }
}