package com.project.credflow.service.impl;

import com.project.credflow.dto.NotificationTemplateDto;
import com.project.credflow.mapper.NotificationTemplateMapper;
import com.project.credflow.model.NotificationTemplate;
import com.project.credflow.repository.NotificationTemplateRepository;
import com.project.credflow.service.inter.NotificationTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationTemplateServiceImpl implements NotificationTemplateService {

    private final NotificationTemplateRepository templateRepository;
    private final NotificationTemplateMapper templateMapper;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationTemplateDto> getAllTemplates() {
        List<NotificationTemplate> templates = templateRepository.findAll();
        return templateMapper.toDtoList(templates);
    }
}