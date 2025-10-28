package com.project.credflow.mapper;

import com.project.credflow.dto.NotificationTemplateDto;
import com.project.credflow.dto.NotificationTemplateRequestDto;
import com.project.credflow.model.NotificationTemplate;
import com.project.credflow.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationTemplateMapper {

    @Mapping(source = "templateId", target = "templateId", qualifiedByName = "uuidToString")
    @Mapping(source = "createdByUser.userId", target = "createdByUserId", qualifiedByName = "uuidToString")
    NotificationTemplateDto toDto(NotificationTemplate entity);

    List<NotificationTemplateDto> toDtoList(List<NotificationTemplate> entities);

    @Mapping(target = "templateId", ignore = true)
    @Mapping(target = "createdByUser", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    NotificationTemplate toEntity(NotificationTemplateRequestDto requestDto);

    @Mapping(target = "templateId", ignore = true)
    @Mapping(target = "createdByUser", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequestDto(NotificationTemplateRequestDto requestDto, @MappingTarget NotificationTemplate entity);

    @Named("uuidToString")
    default String uuidToString(UUID id) {
        return (id != null) ? id.toString() : null;
    }

    @Named("stringToUuid")
    default UUID stringToUuid(String id) {
        if (id == null || id.trim().isEmpty()) {
            return null;
        }
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid UUID string format: " + id);
            return null;
        }
    }
}