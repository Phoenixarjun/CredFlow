package com.project.credflow.mapper;

import com.project.credflow.dto.DunningRuleDto;
import com.project.credflow.model.DunningRule;
import com.project.credflow.model.NotificationTemplate; // Import if needed for mapping templateId
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface DunningRuleMapper {

    DunningRuleMapper INSTANCE = Mappers.getMapper(DunningRuleMapper.class);

    // --- Entity to DTO ---

    @Mapping(source = "template", target = "templateId", qualifiedByName = "templateToTemplateId")
    @Mapping(source = "template.templateName", target = "templateName") // Map template name directly
    DunningRuleDto toDunningRuleDto(DunningRule dunningRule);

    List<DunningRuleDto> toDunningRuleDtoList(List<DunningRule> dunningRules);

    // --- DTO to Entity ---

    @Mapping(source = "templateId", target = "template", qualifiedByName = "templateIdToTemplate")
    @Mapping(target = "createdAt", ignore = true) // Let database/Hibernate handle these
    @Mapping(target = "updatedAt", ignore = true)
    DunningRule toDunningRuleEntity(DunningRuleDto dunningRuleDto);

    // --- Helper methods for nested objects ---

    @Named("templateToTemplateId")
    default UUID templateToTemplateId(NotificationTemplate template) {
        return (template != null) ? template.getTemplateId() : null;
    }

    @Named("templateIdToTemplate")
    default NotificationTemplate templateIdToTemplate(UUID templateId) {
        if (templateId == null) {
            return null;
        }
        // In a real application, you might fetch the template entity from the DB here,
        // but for simple mapping TO entity, just setting the ID is often enough
        // if the relationship is managed correctly.
        // For simplicity now, we'll return null or a placeholder if needed by the service layer later.
        // Or, more commonly, the service layer handles fetching/setting the template entity based on the ID.
        // Let's return null for now, assuming the service will handle it.
        return null; // The Service layer should handle fetching the actual Template entity
        // Or:
        // NotificationTemplate template = new NotificationTemplate();
        // template.setTemplateId(templateId);
        // return template; // Be careful, this is detached and might cause issues if not managed properly.
    }
}