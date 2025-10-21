package com.project.credflow.service.inter;

import com.project.credflow.dto.UserDto;
import java.util.List;

public interface UserService {
    List<UserDto> findUsersByRole(String roleName);
}