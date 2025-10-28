package com.project.credflow.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper; // For parsing JSON response
import com.project.credflow.dto.AiGenerateTemplateRequestDto;
import com.project.credflow.dto.AiGeneratedTemplateResponseDto;
import com.project.credflow.enums.Channel; // Import Channel
import com.project.credflow.service.inter.TemplateAiService;
import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TemplateAiServiceImpl implements TemplateAiService {

    private final ChatLanguageModel chatLanguageModel;
    private final ObjectMapper objectMapper; // For parsing JSON

    // Define the prompt for the AI
    private static final String SYSTEM_PROMPT_TEMPLATE = """
            You are an expert copywriter specializing in clear and effective customer communications for a telecom company (CredFlow).
            Your task is to generate content for a notification template (Email or SMS).
            You MUST include relevant placeholders like {{userName}}, {{invoiceNumber}}, {{amountDue}}, {{dueDate}}, {{accountNumber}} where appropriate.
            Consider the channel (Email requires a subject, SMS does not).
            Analyze the user's request regarding purpose, tone, and key details.

            You MUST return your response ONLY as a single, minified JSON object. Do not use markdown (e.g., ```json).
            The JSON structure MUST be:
            {
              "generatedSubject": "(String: Subject line for EMAIL, null or empty for SMS)",
              "generatedBody": "(String: The main content of the notification)"
            }
            """;

    @Override
    public AiGeneratedTemplateResponseDto generateTemplateContent(AiGenerateTemplateRequestDto requestDto) {
        log.info("Generating AI template content for channel: {}, purpose: {}", requestDto.getChannel(), requestDto.getPurpose());

        String userPrompt = formatRequestForPrompt(requestDto);
        String fullPrompt = SYSTEM_PROMPT_TEMPLATE + "\n\n--- USER REQUEST ---\n" + userPrompt;

        log.debug("Sending full prompt to AI for template generation...");
        String rawResponse = chatLanguageModel.generate(fullPrompt);
        log.debug("Received raw response from AI: {}", rawResponse);

        // Clean the response (remove potential markdown fences and trim)
        String cleanedJsonResponse = rawResponse.trim()
                .replaceFirst("^```json", "")
                .replaceFirst("```$", "")
                .trim();

        log.debug("Cleaned JSON response: {}", cleanedJsonResponse);

        try {
            // Parse the cleaned JSON string
            AiGeneratedTemplateResponseDto generatedDto = objectMapper.readValue(cleanedJsonResponse, AiGeneratedTemplateResponseDto.class);

            // Ensure subject is nullified if channel is SMS, regardless of what AI returned
            if (requestDto.getChannel() == Channel.SMS) {
                generatedDto.setGeneratedSubject(null);
            }
            // Basic validation: ensure body is not empty
            if (generatedDto.getGeneratedBody() == null || generatedDto.getGeneratedBody().isBlank()) {
                log.warn("AI generated an empty body for request: {}", requestDto);
                throw new RuntimeException("AI failed to generate template body.");
            }

            log.info("Successfully parsed AI generated template content.");
            return generatedDto;
        } catch (Exception e) {
            log.error("Failed to parse AI JSON response for template generation. Error: {}. Cleaned response: {}", e.getMessage(), cleanedJsonResponse);
            // Return a fallback DTO on error
            return createErrorResponse(cleanedJsonResponse);
        }
    }


    private String formatRequestForPrompt(AiGenerateTemplateRequestDto requestDto) {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Channel: %s\n", requestDto.getChannel()));
        sb.append(String.format("Purpose: %s\n", requestDto.getPurpose()));
        if (requestDto.getTone() != null && !requestDto.getTone().isBlank()) {
            sb.append(String.format("Desired Tone: %s\n", requestDto.getTone()));
        }
        if (requestDto.getKeyDetails() != null && !requestDto.getKeyDetails().isBlank()) {
            sb.append(String.format("Key Details to Include: %s\n", requestDto.getKeyDetails()));
        }
        return sb.toString();
    }

    private AiGeneratedTemplateResponseDto createErrorResponse(String rawData) {
        log.warn("Creating error response DTO for failed AI template generation.");
        return new AiGeneratedTemplateResponseDto(
                "Error",
                "Failed to generate template content from AI. Raw response: " + rawData
        );
    }
}