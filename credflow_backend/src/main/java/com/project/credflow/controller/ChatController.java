package com.project.credflow.controller;

import com.project.credflow.ai.ChatAssistant;
import com.project.credflow.dto.ChatRequestDto;
import com.project.credflow.dto.ChatResponseDto;
import com.project.credflow.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatAssistant chatAssistant;

    @PostMapping("/message")
    public ResponseEntity<ChatResponseDto> sendMessage(@RequestBody ChatRequestDto request) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.status(401).body(
                        new ChatResponseDto("Please log in to use the chat assistant.", null)
                );
            }

            User currentUser = (User) authentication.getPrincipal();
            String chatId = "user-" + currentUser.getUserId(); // Unique chat ID per user

            log.info("Processing chat message for user: {}, chatId: {}", currentUser.getUsername(), chatId);

            // Call the AI assistant with memory
            String response = chatAssistant.chat(chatId, request.getMessage());

            log.info("AI response generated for chatId: {}", chatId);

            return ResponseEntity.ok(new ChatResponseDto(response, chatId));

        } catch (Exception e) {
            log.error("Error processing chat message", e);
            return ResponseEntity.status(500).body(
                    new ChatResponseDto("Sorry, I encountered an error. Please try again.", null)
            );
        }
    }

    @DeleteMapping("/clear/{chatId}")
    public ResponseEntity<Void> clearChatHistory(@PathVariable String chatId) {
        try {
            log.info("Chat history clear requested for chatId: {}", chatId);
            // Note: ChatMemory doesn't expose clear() directly in current implementation
            // You might need to implement a custom ChatMemoryStore for this feature
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error clearing chat history", e);
            return ResponseEntity.status(500).build();
        }
    }
}