package com.project.credflow.service.impl;

import com.project.credflow.dto.UserDto;
import com.project.credflow.enums.RoleName;
import com.project.credflow.mapper.UserMapper; // We'll create this
import com.project.credflow.model.User;
import com.project.credflow.repository.UserRepository;
import com.project.credflow.service.inter.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserDto> findUsersByRole(String roleName) {
        // Find users by the RoleName enum
        List<User> users = userRepository.findByRole_RoleName(RoleName.valueOf(roleName));
        return users.stream()
                .map(userMapper::toUserDto)
                .collect(Collectors.toList());
    }
}