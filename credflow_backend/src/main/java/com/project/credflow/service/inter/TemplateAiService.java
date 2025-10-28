package com.project.credflow.service.inter;

import com.project.credflow.dto.AiGenerateTemplateRequestDto;
import com.project.credflow.dto.AiGeneratedTemplateResponseDto;


public interface TemplateAiService {

    AiGeneratedTemplateResponseDto generateTemplateContent(AiGenerateTemplateRequestDto requestDto);
}