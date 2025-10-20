package com.project.credflow.service.impl;

import com.project.credflow.dto.DunningRuleDto;
import com.project.credflow.enums.BpoTaskPriority;
import com.project.credflow.enums.RuleActionType;
import com.project.credflow.enums.RuleConditionType;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.mapper.DunningRuleMapper;
import com.project.credflow.model.DunningRule;
import com.project.credflow.model.NotificationTemplate;
import com.project.credflow.repository.DunningRuleRepository;
import com.project.credflow.repository.NotificationTemplateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DunningRuleServiceImplTest {

    @Mock
    private DunningRuleRepository dunningRuleRepository;

    @Mock
    private DunningRuleMapper dunningRuleMapper;

    @Mock
    private NotificationTemplateRepository notificationTemplateRepository;

    @InjectMocks
    private DunningRuleServiceImpl dunningRuleService;

    private DunningRule testDunningRule;
    private DunningRuleDto testDunningRuleDto;
    private NotificationTemplate testTemplate;
    private UUID testRuleId;
    private UUID testTemplateId;

    @BeforeEach
    void setUp() {
        testRuleId = UUID.randomUUID();
        testTemplateId = UUID.randomUUID();

        testTemplate = new NotificationTemplate();
        testTemplate.setTemplateId(testTemplateId);
        testTemplate.setTemplateName("Test Template");

        testDunningRule = new DunningRule();
        testDunningRule.setRuleId(testRuleId);
        testDunningRule.setRuleName("Test Rule");
        testDunningRule.setDescription("Test Description");
        testDunningRule.setPriority(1);
        testDunningRule.setIsActive(true);
        testDunningRule.setConditionType(RuleConditionType.DAYS_OVERDUE);
        testDunningRule.setConditionValueInteger(30);
        testDunningRule.setActionType(RuleActionType.SEND_EMAIL);
        testDunningRule.setTemplate(testTemplate);
        testDunningRule.setBpoTaskPriority(BpoTaskPriority.HIGH);
        testDunningRule.setCreatedAt(LocalDateTime.now());
        testDunningRule.setUpdatedAt(LocalDateTime.now());

        testDunningRuleDto = new DunningRuleDto();
        testDunningRuleDto.setRuleId(testRuleId);
        testDunningRuleDto.setRuleName("Test Rule");
        testDunningRuleDto.setDescription("Test Description");
        testDunningRuleDto.setPriority(1);
        testDunningRuleDto.setIsActive(true);
        testDunningRuleDto.setConditionType(RuleConditionType.DAYS_OVERDUE);
        testDunningRuleDto.setConditionValueInteger(30);
        testDunningRuleDto.setActionType(RuleActionType.SEND_EMAIL);
        testDunningRuleDto.setTemplateId(testTemplateId);
        testDunningRuleDto.setTemplateName("Test Template");
        testDunningRuleDto.setBpoTaskPriority(BpoTaskPriority.HIGH);
        testDunningRuleDto.setCreatedAt(LocalDateTime.now());
        testDunningRuleDto.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void createDunningRule_ValidDto_ReturnsCreatedRule() {
        // Given
        DunningRuleDto inputDto = new DunningRuleDto();
        inputDto.setRuleName("New Rule");
        inputDto.setDescription("New Description");
        inputDto.setPriority(2);
        inputDto.setIsActive(true);
        inputDto.setConditionType(RuleConditionType.MIN_AMOUNT_DUE);
        inputDto.setConditionValueDecimal(new BigDecimal("1000.00"));
        inputDto.setActionType(RuleActionType.CREATE_BPO_TASK);
        inputDto.setBpoTaskPriority(BpoTaskPriority.MEDIUM);

        DunningRule entityToSave = new DunningRule();
        entityToSave.setRuleName("New Rule");

        DunningRule savedEntity = new DunningRule();
        savedEntity.setRuleId(UUID.randomUUID());
        savedEntity.setRuleName("New Rule");

        DunningRuleDto expectedDto = new DunningRuleDto();
        expectedDto.setRuleId(savedEntity.getRuleId());
        expectedDto.setRuleName("New Rule");

        when(dunningRuleMapper.toDunningRuleEntity(inputDto)).thenReturn(entityToSave);
        when(dunningRuleRepository.save(entityToSave)).thenReturn(savedEntity);
        when(dunningRuleMapper.toDunningRuleDto(savedEntity)).thenReturn(expectedDto);

        // When
        DunningRuleDto result = dunningRuleService.createDunningRule(inputDto);

        // Then
        assertNotNull(result);
        assertEquals(expectedDto.getRuleId(), result.getRuleId());
        assertEquals("New Rule", result.getRuleName());

        verify(dunningRuleMapper).toDunningRuleEntity(inputDto);
        verify(dunningRuleRepository).save(entityToSave);
        verify(dunningRuleMapper).toDunningRuleDto(savedEntity);
    }

    @Test
    void getDunningRuleById_ExistingId_ReturnsRule() {
        // Given
        when(dunningRuleRepository.findById(testRuleId)).thenReturn(Optional.of(testDunningRule));
        when(dunningRuleMapper.toDunningRuleDto(testDunningRule)).thenReturn(testDunningRuleDto);

        // When
        DunningRuleDto result = dunningRuleService.getDunningRuleById(testRuleId);

        // Then
        assertNotNull(result);
        assertEquals(testRuleId, result.getRuleId());
        assertEquals("Test Rule", result.getRuleName());

        verify(dunningRuleRepository).findById(testRuleId);
        verify(dunningRuleMapper).toDunningRuleDto(testDunningRule);
    }

    @Test
    void getAllDunningRules_ExistingRules_ReturnsRuleList() {
        // Given
        DunningRule rule2 = new DunningRule();
        rule2.setRuleId(UUID.randomUUID());
        rule2.setRuleName("Test Rule 2");

        DunningRuleDto dto2 = new DunningRuleDto();
        dto2.setRuleId(rule2.getRuleId());
        dto2.setRuleName("Test Rule 2");

        List<DunningRule> rules = Arrays.asList(testDunningRule, rule2);
        List<DunningRuleDto> expectedDtos = Arrays.asList(testDunningRuleDto, dto2);

        when(dunningRuleRepository.findAll()).thenReturn(rules);
        when(dunningRuleMapper.toDunningRuleDtoList(rules)).thenReturn(expectedDtos);

        // When
        List<DunningRuleDto> result = dunningRuleService.getAllDunningRules();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Rule", result.get(0).getRuleName());
        assertEquals("Test Rule 2", result.get(1).getRuleName());

        verify(dunningRuleRepository).findAll();
        verify(dunningRuleMapper).toDunningRuleDtoList(rules);
    }

    @Test
    void getAllDunningRules_NoRules_ReturnsEmptyList() {
        // Given
        List<DunningRule> emptyRules = Collections.emptyList();
        List<DunningRuleDto> emptyDtos = Collections.emptyList();

        when(dunningRuleRepository.findAll()).thenReturn(emptyRules);
        when(dunningRuleMapper.toDunningRuleDtoList(emptyRules)).thenReturn(emptyDtos);

        // When
        List<DunningRuleDto> result = dunningRuleService.getAllDunningRules();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(dunningRuleRepository).findAll();
        verify(dunningRuleMapper).toDunningRuleDtoList(emptyRules);
    }

    @Test
    void updateDunningRule_ExistingRule_ReturnsUpdatedRule() {
        // Given
        DunningRuleDto updateDto = new DunningRuleDto();
        updateDto.setRuleName("Updated Rule");
        updateDto.setDescription("Updated Description");
        updateDto.setPriority(3);
        updateDto.setIsActive(false);

        DunningRule existingRule = new DunningRule();
        existingRule.setRuleId(testRuleId);
        existingRule.setRuleName("Old Rule");

        DunningRule updatedRule = new DunningRule();
        updatedRule.setRuleId(testRuleId);
        updatedRule.setRuleName("Updated Rule");

        DunningRuleDto expectedDto = new DunningRuleDto();
        expectedDto.setRuleId(testRuleId);
        expectedDto.setRuleName("Updated Rule");

        when(dunningRuleRepository.findById(testRuleId)).thenReturn(Optional.of(existingRule));
        when(dunningRuleRepository.save(any(DunningRule.class))).thenReturn(updatedRule);
        when(dunningRuleMapper.toDunningRuleDto(updatedRule)).thenReturn(expectedDto);

        // When
        DunningRuleDto result = dunningRuleService.updateDunningRule(testRuleId, updateDto);

        // Then
        assertNotNull(result);
        assertEquals(testRuleId, result.getRuleId());
        assertEquals("Updated Rule", result.getRuleName());

        verify(dunningRuleRepository).findById(testRuleId);
        verify(dunningRuleRepository).save(any(DunningRule.class));
        verify(dunningRuleMapper).toDunningRuleDto(updatedRule);
    }

    @Test
    void deleteDunningRule_ExistingRule_DeletesSuccessfully() {
        // Given
        when(dunningRuleRepository.existsById(testRuleId)).thenReturn(true);

        // When
        assertDoesNotThrow(() -> dunningRuleService.deleteDunningRule(testRuleId));

        // Then
        verify(dunningRuleRepository).existsById(testRuleId);
        verify(dunningRuleRepository).deleteById(testRuleId);
    }

    @Test
    void getDunningRuleById_NonexistentId_ThrowsResourceNotFoundException() {
        // Given
        UUID nonexistentId = UUID.randomUUID();
        when(dunningRuleRepository.findById(nonexistentId)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            dunningRuleService.getDunningRuleById(nonexistentId);
        });

        assertEquals("Dunning Rule not found with ID: " + nonexistentId, exception.getMessage());
        verify(dunningRuleRepository).findById(nonexistentId);
        verify(dunningRuleMapper, never()).toDunningRuleDto(any(DunningRule.class));
    }

    @Test
    void updateDunningRule_NonexistentRule_ThrowsResourceNotFoundException() {
        // Given
        UUID nonexistentId = UUID.randomUUID();
        DunningRuleDto updateDto = new DunningRuleDto();
        updateDto.setRuleName("Updated Rule");

        when(dunningRuleRepository.findById(nonexistentId)).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            dunningRuleService.updateDunningRule(nonexistentId, updateDto);
        });

        assertEquals("Dunning Rule not found with ID: " + nonexistentId, exception.getMessage());
        verify(dunningRuleRepository).findById(nonexistentId);
        verify(dunningRuleRepository, never()).save(any(DunningRule.class));
        verify(dunningRuleMapper, never()).toDunningRuleDto(any(DunningRule.class));
    }

    @Test
    void deleteDunningRule_NonexistentRule_ThrowsResourceNotFoundException() {
        // Given
        UUID nonexistentId = UUID.randomUUID();
        when(dunningRuleRepository.existsById(nonexistentId)).thenReturn(false);

        // When & Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            dunningRuleService.deleteDunningRule(nonexistentId);
        });

        assertEquals("Dunning Rule not found with ID: " + nonexistentId, exception.getMessage());
        verify(dunningRuleRepository).existsById(nonexistentId);
        verify(dunningRuleRepository, never()).deleteById(any(UUID.class));
    }
}