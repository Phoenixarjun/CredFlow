// in: com.project.credflow.mapper.UserMapper.java
package com.project.credflow.mapper;

import com.project.credflow.dto.UserDto;
import com.project.credflow.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toUserDto(User user) {
        if (user == null) {
            return null;
        }
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRoleName(user.getRole().getRoleName().name());
        return dto;
    }
}