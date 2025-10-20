package com.project.credflow.controller;

import com.project.credflow.dto.DunningRuleDto;
import com.project.credflow.dto.NotificationTemplateDto;
import com.project.credflow.service.inter.DunningRuleService;
import com.project.credflow.service.inter.NotificationTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DunningRuleService dunningRuleService;
    private final NotificationTemplateService templateService;

    @PostMapping("/rules")
    public ResponseEntity<DunningRuleDto> createRule(@Valid @RequestBody DunningRuleDto dunningRuleDto) {
        DunningRuleDto createdRule = dunningRuleService.createDunningRule(dunningRuleDto);
        return new ResponseEntity<>(createdRule, HttpStatus.CREATED);
    }

    @GetMapping("/rules")
    public ResponseEntity<List<DunningRuleDto>> getAllRules() {
        List<DunningRuleDto> rules = dunningRuleService.getAllDunningRules();
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/rules/{ruleId}")
    public ResponseEntity<DunningRuleDto> getRuleById(@PathVariable UUID ruleId) {
        DunningRuleDto rule = dunningRuleService.getDunningRuleById(ruleId);
        return ResponseEntity.ok(rule);
    }

    @PutMapping("/rules/{ruleId}")
    public ResponseEntity<DunningRuleDto> updateRule(@PathVariable UUID ruleId, @Valid @RequestBody DunningRuleDto dunningRuleDto) {
        DunningRuleDto updatedRule = dunningRuleService.updateDunningRule(ruleId, dunningRuleDto);
        return ResponseEntity.ok(updatedRule);
    }


    @DeleteMapping("/rules/{ruleId}")
    public ResponseEntity<Void> deleteRule(@PathVariable UUID ruleId) {
        dunningRuleService.deleteDunningRule(ruleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/notification-templates")
    public ResponseEntity<List<NotificationTemplateDto>> getAllTemplates() {
        List<NotificationTemplateDto> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }

}