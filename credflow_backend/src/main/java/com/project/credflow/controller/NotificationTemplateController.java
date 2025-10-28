package com.project.credflow.controller;

import com.project.credflow.dto.NotificationTemplateDto;
import com.project.credflow.dto.NotificationTemplateRequestDto;
import com.project.credflow.model.User;
import com.project.credflow.service.inter.NotificationTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Import for method security
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/templates") // Base path under admin
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Secure all methods in this controller for ADMIN role
public class NotificationTemplateController {

    private final NotificationTemplateService templateService;


    @GetMapping
    public ResponseEntity<List<NotificationTemplateDto>> getAllTemplates() {
        List<NotificationTemplateDto> templates = templateService.getAllTemplates();
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationTemplateDto> getTemplateById(@PathVariable UUID id) {
        NotificationTemplateDto template = templateService.getTemplateById(id);
        return ResponseEntity.ok(template);
    }

    @PostMapping
    public ResponseEntity<NotificationTemplateDto> createTemplate(
            @Valid @RequestBody NotificationTemplateRequestDto requestDto,
            @AuthenticationPrincipal User currentUser) { // Get logged-in user
        NotificationTemplateDto createdTemplate = templateService.createTemplate(requestDto, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTemplate);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationTemplateDto> updateTemplate(
            @PathVariable UUID id,
            @Valid @RequestBody NotificationTemplateRequestDto requestDto) {
        NotificationTemplateDto updatedTemplate = templateService.updateTemplate(id, requestDto);
        return ResponseEntity.ok(updatedTemplate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable UUID id) {
        templateService.deleteTemplate(id);
        // Return 204 No Content status
        return ResponseEntity.noContent().build();
    }
}