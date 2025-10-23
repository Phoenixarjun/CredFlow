package com.project.credflow.service.impl;

import com.project.credflow.dto.CreateUserRequestDto;
import com.project.credflow.dto.UserDto;
import com.project.credflow.enums.RoleName;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.exception.BadRequestException;
import com.project.credflow.mapper.UserMapper;
import com.project.credflow.model.Role;
import com.project.credflow.model.User;
import com.project.credflow.repository.RoleRepository;
import com.project.credflow.repository.UserRepository;
import com.project.credflow.service.inter.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> findUsersByRole(String roleName) {
        log.info("Finding users with role: {}", roleName);
        RoleName roleEnum = RoleName.valueOf(roleName.toUpperCase());
        List<User> users = userRepository.findByRole_RoleName(roleEnum);
        return users.stream().map(userMapper::toUserDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll().stream().map(userMapper::toUserDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(UUID userId) {
        log.info("Fetching user by ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return userMapper.toUserDto(user);
    }

    @Override
    @Transactional
    public UserDto createUser(CreateUserRequestDto dto) {
        log.info("Creating new user with email: {}", dto.getEmail());

        // Check for existing email (this is the new username)
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BadRequestException("Email address already in use: " + dto.getEmail());
        }

        // Find the role
        RoleName roleEnum = RoleName.valueOf(dto.getRoleName().toUpperCase());
        Role userRole = roleRepository.findByRoleName(roleEnum)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: ".concat(dto.getRoleName())));

        // Create and save the new user
        User newUser = new User();
        newUser.setEmail(dto.getEmail()); // Use email as the primary identifier
        newUser.setFullName(dto.getFullName());
        newUser.setPhoneNumber(dto.getPhoneNumber());
        newUser.setPasswordHash(passwordEncoder.encode(dto.getPassword())); // Use setPasswordHash
        newUser.setRole(userRole);
        newUser.setIsActive(dto.getIsActive()); // Use setIsActive

        User savedUser = userRepository.save(newUser);
        log.info("User created successfully with ID: {}", savedUser.getUserId());
        return userMapper.toUserDto(savedUser);
    }

    @Override
    @Transactional
    public UserDto updateUser(UUID userId, UserDto userDto) {
        log.info("Updating user with ID: {}", userId);

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Update basic fields
        existingUser.setFullName(userDto.getFullName());
        existingUser.setPhoneNumber(userDto.getPhoneNumber());
        existingUser.setIsActive(userDto.getIsActive()); // Use setIsActive

        // Update email only if it's different and not already taken
        if (!existingUser.getEmail().equalsIgnoreCase(userDto.getEmail())) {
            if (userRepository.existsByEmail(userDto.getEmail())) {
                throw new BadRequestException("Email address already in use: " + userDto.getEmail());
            }
            existingUser.setEmail(userDto.getEmail());
            log.info("User {} email updated to {}", userId, userDto.getEmail());
        }

        // NO 'username' logic needed

        // Update role if it's different
        Role currentRole = existingUser.getRole();
        if (currentRole == null || !currentRole.getRoleName().name().equalsIgnoreCase(userDto.getRoleName())) {
            RoleName newRoleEnum = RoleName.valueOf(userDto.getRoleName().toUpperCase());
            Role newRole = roleRepository.findByRoleName(newRoleEnum)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + userDto.getRoleName()));
            existingUser.setRole(newRole);
            log.info("User {} role updated to {}", userId, userDto.getRoleName());
        }

        User updatedUser = userRepository.save(existingUser);
        log.info("User {} updated successfully", userId);
        return userMapper.toUserDto(updatedUser);
    }
}