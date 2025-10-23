package com.project.credflow.service.inter;

import com.project.credflow.dto.CreateUserRequestDto;
import com.project.credflow.dto.UserDto;
import java.util.List;
import java.util.UUID;

public interface UserService {
    List<UserDto> findUsersByRole(String roleName);
    List<UserDto> getAllUsers();
    UserDto getUserById(UUID userId);
    UserDto createUser(CreateUserRequestDto createUserRequestDto);
    UserDto updateUser(UUID userId, UserDto userDto);
}