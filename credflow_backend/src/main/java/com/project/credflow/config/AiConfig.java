package com.project.credflow.config;

import com.project.credflow.ai.ChatAssistant;
import com.project.credflow.ai.CredFlowTools;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel; // 1. Import the model class
import dev.langchain4j.service.AiServices;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import dev.langchain4j.store.memory.chat.InMemoryChatMemoryStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    /**
     * In-memory chat memory store for multiple users.
     */
    @Bean
    public ChatMemoryStore chatMemoryStore() {
        return new InMemoryChatMemoryStore();
    }

    /**
     * --- NEW ---
     * Manually creates the ChatLanguageModel bean by bypassing Spring auto-configuration.
     * This method directly reads the environment variable you set in your IDE's Run Configuration.
     */
    @Bean
    public ChatLanguageModel chatLanguageModel() {
        // 1. Read the API key from the environment variable
        String apiKey = System.getenv("GOOGLE_API_KEY");

        // 2. Validate that the key was found
        if (apiKey == null || apiKey.trim().isEmpty()) {
            // This error will stop the application if the key isn't in your Run Configuration
            throw new RuntimeException(
                    "Error: GOOGLE_API_KEY environment variable is not set. " +
                            "Please set it in your IDE's Run Configuration."
            );
        }

        // 3. Manually build and return the GoogleAiGeminiChatModel
        return GoogleAiGeminiChatModel.builder()
                .apiKey(apiKey)
                .modelName("gemini-2.0-flash") // Use a known stable model
                .temperature(0.5) // Use 'f' for float
                .maxOutputTokens(2048)
                .build();
    }

    /**
     * Creates the AiServices implementation of the ChatAssistant interface.
     * This method no longer needs to change. Spring will inject the
     * ChatLanguageModel bean we created manually above.
     */
    @Bean
    public ChatAssistant chatAssistant(ChatLanguageModel chatLanguageModel, // <-- Spring finds our manual bean
                                       ChatMemoryStore chatMemoryStore,
                                       CredFlowTools credFlowTools) {

        return AiServices.builder(ChatAssistant.class)
                .chatLanguageModel(chatLanguageModel)
                .chatMemoryProvider(chatId -> MessageWindowChatMemory.builder()
                        .chatMemoryStore(chatMemoryStore)
                        .maxMessages(20)
                        .id(chatId)
                        .build())
                .tools(credFlowTools)
                .build();
    }
}