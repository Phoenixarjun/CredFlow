package com.project.credflow.service.inter;

import com.project.credflow.dto.DunningRuleDto;
import com.project.credflow.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;

public interface DunningRuleService {

    DunningRuleDto createDunningRule(DunningRuleDto dunningRuleDto);

    DunningRuleDto getDunningRuleById(UUID ruleId) throws ResourceNotFoundException;

    List<DunningRuleDto> getAllDunningRules();

    DunningRuleDto updateDunningRule(UUID ruleId, DunningRuleDto dunningRuleDto) throws ResourceNotFoundException;

    void deleteDunningRule(UUID ruleId) throws ResourceNotFoundException;

}