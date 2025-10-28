package com.project.credflow.controller;

import com.project.credflow.dto.AiGenerateTemplateRequestDto;
import com.project.credflow.dto.AiGeneratedTemplateResponseDto;
import com.project.credflow.service.inter.TemplateAiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/templates/ai") // Specific sub-path for AI actions
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Secure endpoint for ADMIN role
public class TemplateAiController {

    private final TemplateAiService templateAiService;


    @PostMapping("/generate")
    public ResponseEntity<AiGeneratedTemplateResponseDto> generateTemplateContent(
            @Valid @RequestBody AiGenerateTemplateRequestDto requestDto) {
        AiGeneratedTemplateResponseDto response = templateAiService.generateTemplateContent(requestDto);
        return ResponseEntity.ok(response);
    }
}