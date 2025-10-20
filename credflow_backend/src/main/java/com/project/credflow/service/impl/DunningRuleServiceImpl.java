package com.project.credflow.service.impl;

import com.project.credflow.dto.DunningRuleDto;
import com.project.credflow.enums.RuleActionType;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.mapper.DunningRuleMapper;
import com.project.credflow.model.DunningRule;
import com.project.credflow.model.NotificationTemplate;
import com.project.credflow.repository.DunningRuleRepository;
import com.project.credflow.repository.NotificationTemplateRepository;
import com.project.credflow.service.inter.DunningRuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DunningRuleServiceImpl implements DunningRuleService {

    private final DunningRuleRepository dunningRuleRepository;
    private final DunningRuleMapper dunningRuleMapper;
    private final NotificationTemplateRepository notificationTemplateRepository;

    @Override
    @Transactional
    public DunningRuleDto createDunningRule(DunningRuleDto dunningRuleDto) {
        dunningRuleRepository.findByRuleName(dunningRuleDto.getRuleName()).ifPresent(rule -> {
            throw new IllegalArgumentException("Dunning rule with name '" + dunningRuleDto.getRuleName() + "' already exists.");
        });

        DunningRule dunningRule = dunningRuleMapper.toDunningRuleEntity(dunningRuleDto);

        linkNotificationTemplate(dunningRuleDto, dunningRule);

        DunningRule savedRule = dunningRuleRepository.save(dunningRule);
        return dunningRuleMapper.toDunningRuleDto(savedRule);
    }

    @Override
    @Transactional(readOnly = true)
    public DunningRuleDto getDunningRuleById(UUID ruleId) throws ResourceNotFoundException {
        DunningRule dunningRule = dunningRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Dunning Rule not found with ID: " + ruleId));
        return dunningRuleMapper.toDunningRuleDto(dunningRule);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DunningRuleDto> getAllDunningRules() {
        List<DunningRule> dunningRules = dunningRuleRepository.findAll(Sort.by(Sort.Direction.ASC, "priority"));
        return dunningRuleMapper.toDunningRuleDtoList(dunningRules);
    }

    @Override
    @Transactional
    public DunningRuleDto updateDunningRule(UUID ruleId, DunningRuleDto dunningRuleDto) throws ResourceNotFoundException {
        DunningRule existingRule = dunningRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Dunning Rule not found with ID: " + ruleId));

        dunningRuleRepository.findByRuleName(dunningRuleDto.getRuleName()).ifPresent(rule -> {
            if (!rule.getRuleId().equals(ruleId)) {
                throw new IllegalArgumentException("Another dunning rule with name '" + dunningRuleDto.getRuleName() + "' already exists.");
            }
        });

        existingRule.setRuleName(dunningRuleDto.getRuleName());
        existingRule.setDescription(dunningRuleDto.getDescription());
        existingRule.setPriority(dunningRuleDto.getPriority());
        existingRule.setIsActive(dunningRuleDto.getIsActive());
        existingRule.setConditionType(dunningRuleDto.getConditionType());
        existingRule.setConditionValueInteger(dunningRuleDto.getConditionValueInteger());
        existingRule.setConditionValueDecimal(dunningRuleDto.getConditionValueDecimal());
        existingRule.setConditionValueString(dunningRuleDto.getConditionValueString());
        existingRule.setActionType(dunningRuleDto.getActionType());
        existingRule.setBpoTaskPriority(dunningRuleDto.getBpoTaskPriority());

        linkNotificationTemplate(dunningRuleDto, existingRule);

        DunningRule updatedRule = dunningRuleRepository.save(existingRule);
        return dunningRuleMapper.toDunningRuleDto(updatedRule);
    }

    @Override
    @Transactional
    public void deleteDunningRule(UUID ruleId) throws ResourceNotFoundException {
        if (!dunningRuleRepository.existsById(ruleId)) {
            throw new ResourceNotFoundException("Dunning Rule not found with ID: " + ruleId);
        }
        dunningRuleRepository.deleteById(ruleId);
    }

    private void linkNotificationTemplate(DunningRuleDto dto, DunningRule entity) {
        if (dto.getActionType() == RuleActionType.SEND_EMAIL && dto.getTemplateId() != null) {
            NotificationTemplate template = notificationTemplateRepository.findById(dto.getTemplateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Notification Template not found with ID: " + dto.getTemplateId() + ". Cannot link rule."));
            entity.setTemplate(template);
        } else {
            entity.setTemplate(null);
        }
    }
}