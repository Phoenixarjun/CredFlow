package com.project.credflow.service.inter;

import com.project.credflow.dto.NotificationTemplateDto;
import java.util.List;

public interface NotificationTemplateService {


    List<NotificationTemplateDto> getAllTemplates();

    // We can add create, update, delete methods here later
}