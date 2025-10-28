package com.project.credflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiGeneratedTemplateResponseDto {

    private String generatedSubject;
    private String generatedBody;
}