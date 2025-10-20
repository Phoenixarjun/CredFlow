package com.project.credflow.mapper;

import com.project.credflow.dto.NotificationTemplateDto;
import com.project.credflow.model.NotificationTemplate;
import com.project.credflow.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface NotificationTemplateMapper {

    NotificationTemplateMapper INSTANCE = Mappers.getMapper(NotificationTemplateMapper.class);

    // --- Entity to DTO ---

    @Mapping(source = "templateId", target = "templateId", qualifiedByName = "uuidToString") // Convert UUID -> String
    @Mapping(source = "createdByUser", target = "createdByUserId", qualifiedByName = "userToUserIdString") // Extract User's UUID -> String
    NotificationTemplateDto toDto(NotificationTemplate template);

    List<NotificationTemplateDto> toDtoList(List<NotificationTemplate> templates);

    // --- DTO to Entity --- (Ensure Service layer handles User lookup)

    @Mapping(source = "templateId", target = "templateId", qualifiedByName = "stringToUuid") // Convert String -> UUID
    @Mapping(target = "createdByUser", ignore = true) // Service must set this
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    NotificationTemplate toEntity(NotificationTemplateDto dto);


    // --- Helper Methods ---

    // Converts UUID object to its String representation
    @Named("uuidToString")
    default String uuidToString(UUID id) {
        return (id != null) ? id.toString() : null;
    }

    // Converts UUID String back to UUID object
    @Named("stringToUuid")
    default UUID stringToUuid(String id) {
        if (id == null || id.trim().isEmpty()) {
            return null;
        }
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            // Handle invalid UUID string if necessary, maybe log or return null
            System.err.println("Invalid UUID string format: " + id);
            return null;
        }
    }

    // Extracts the User's UUID and converts it to String
    @Named("userToUserIdString")
    default String userToUserIdString(User user) {
        return (user != null && user.getUserId() != null) ? user.getUserId().toString() : null;
    }
}