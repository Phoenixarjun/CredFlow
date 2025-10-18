package com.project.credflow.service.impl;

import com.project.credflow.dto.AuthResponse;
import com.project.credflow.dto.LoginRequest;
import com.project.credflow.dto.RegisterRequest;
import com.project.credflow.exception.AuthException;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.mapper.UserMapper;
import com.project.credflow.model.Role;
import com.project.credflow.model.User;
import com.project.credflow.repository.RoleRepository;
import com.project.credflow.repository.UserRepository;
import com.project.credflow.security.JwtUtil;
import com.project.credflow.service.inter.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.project.credflow.dto.UserDto;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           AuthenticationManager authenticationManager,
                           UserMapper userMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new AuthException("Email already in use");
        }

        Role userRole = roleRepository.findByRoleName(registerRequest.getRoleName())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + registerRequest.getRoleName()));

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(userRole);
        user.setIsActive(true); // Activate user on registration

        User savedUser = userRepository.save(user);

        // TODO: Add logic here to create a Customer entity if role is CUSTOMER

        String token = jwtUtil.generateToken(savedUser);
        return new AuthResponse(token, userMapper.toUserDto(savedUser));
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new AuthException("Invalid email or password");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, userMapper.toUserDto(user));
    }

    @Override
    public UserDto getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        return userMapper.toUserDto(currentUser);
    }
}