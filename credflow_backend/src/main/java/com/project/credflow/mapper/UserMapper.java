package com.project.credflow.mapper;

import com.project.credflow.dto.UserDto;
import com.project.credflow.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "userId", target = "userId", qualifiedByName = "uuidToString")
    @Mapping(source = "role.roleName", target = "roleName")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "isActive", target = "isActive")
    UserDto toUserDto(User user);

    @Named("uuidToString")
    default String uuidToString(UUID id) {
        return (id != null) ? id.toString() : null;
    }
}