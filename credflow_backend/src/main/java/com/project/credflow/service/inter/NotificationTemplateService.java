package com.project.credflow.service.inter;

import com.project.credflow.dto.NotificationTemplateDto;
import com.project.credflow.dto.NotificationTemplateRequestDto; // Import Request DTO
import com.project.credflow.model.User; // Import User

import java.util.List;
import java.util.UUID; // Import UUID

public interface NotificationTemplateService {

    List<NotificationTemplateDto> getAllTemplates();

    NotificationTemplateDto getTemplateById(UUID templateId);

    NotificationTemplateDto createTemplate(NotificationTemplateRequestDto requestDto, User currentUser);

    NotificationTemplateDto updateTemplate(UUID templateId, NotificationTemplateRequestDto requestDto);

    void deleteTemplate(UUID templateId);
}