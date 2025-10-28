package com.project.credflow.service.impl;

import com.project.credflow.dto.NotificationTemplateDto;
import com.project.credflow.dto.NotificationTemplateRequestDto;
import com.project.credflow.exception.ResourceNotFoundException; // Import Exception
import com.project.credflow.mapper.NotificationTemplateMapper;
import com.project.credflow.model.NotificationTemplate;
import com.project.credflow.model.User; // Import User
import com.project.credflow.repository.NotificationTemplateRepository;
import com.project.credflow.service.inter.NotificationTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Import Slf4j
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID; // Import UUID

@Service
@RequiredArgsConstructor
@Slf4j // Add logging
public class NotificationTemplateServiceImpl implements NotificationTemplateService {

    private final NotificationTemplateRepository templateRepository;
    private final NotificationTemplateMapper templateMapper;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationTemplateDto> getAllTemplates() {
        log.info("Fetching all notification templates");
        List<NotificationTemplate> templates = templateRepository.findAll();
        // Consider sorting if needed, e.g., by name or createdAt
        // templates.sort(Comparator.comparing(NotificationTemplate::getTemplateName));
        return templateMapper.toDtoList(templates);
    }

    // --- Implement CRUD Methods ---

    @Override
    @Transactional(readOnly = true)
    public NotificationTemplateDto getTemplateById(UUID templateId) {
        log.info("Fetching notification template by ID: {}", templateId);
        NotificationTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification Template not found with ID: " + templateId));
        return templateMapper.toDto(template);
    }

    @Override
    @Transactional
    public NotificationTemplateDto createTemplate(NotificationTemplateRequestDto requestDto, User currentUser) {
        log.info("Creating new notification template with name: {}", requestDto.getTemplateName());
        // Check for duplicate name? The DB constraint handles it, but service layer check can be cleaner.
        // if (templateRepository.existsByTemplateName(requestDto.getTemplateName())) {
        //     throw new BadRequestException("Template name already exists: " + requestDto.getTemplateName());
        // }

        NotificationTemplate newTemplate = templateMapper.toEntity(requestDto);
        newTemplate.setCreatedByUser(currentUser); // Set the creator

        NotificationTemplate savedTemplate = templateRepository.save(newTemplate);
        log.info("Notification template created successfully with ID: {}", savedTemplate.getTemplateId());
        return templateMapper.toDto(savedTemplate);
    }

    @Override
    @Transactional
    public NotificationTemplateDto updateTemplate(UUID templateId, NotificationTemplateRequestDto requestDto) {
        log.info("Updating notification template with ID: {}", templateId);
        NotificationTemplate existingTemplate = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification Template not found with ID: " + templateId));

        // Use mapper to update fields from DTO
        templateMapper.updateEntityFromRequestDto(requestDto, existingTemplate);
        // Note: createdByUser and createdAt are not updated

        NotificationTemplate updatedTemplate = templateRepository.save(existingTemplate);
        log.info("Notification template updated successfully: {}", templateId);
        return templateMapper.toDto(updatedTemplate);
    }

    @Override
    @Transactional
    public void deleteTemplate(UUID templateId) {
        log.info("Deleting notification template with ID: {}", templateId);
        NotificationTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification Template not found with ID: " + templateId));

        // Add check: Is this template currently used by any Dunning Rules?
        // If so, maybe prevent deletion or warn the user. Requires DunningRuleRepository.
        // Example check (requires injecting DunningRuleRepository):
        // if (dunningRuleRepository.existsByTemplate_TemplateId(templateId)) {
        //     log.warn("Attempt to delete template {} which is currently used by dunning rules.", templateId);
        //     throw new DataIntegrityViolationException("Cannot delete template: It is currently assigned to one or more dunning rules.");
        // }

        templateRepository.delete(template);
        log.info("Notification template deleted successfully: {}", templateId);
    }
    // ----------------------------
}