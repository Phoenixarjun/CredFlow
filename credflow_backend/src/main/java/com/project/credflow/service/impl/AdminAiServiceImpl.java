package com.project.credflow.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.credflow.dto.*;
import com.project.credflow.service.inter.AdminAiService;
import com.project.credflow.service.inter.CustomerService;
import dev.langchain4j.model.chat.ChatLanguageModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAiServiceImpl implements AdminAiService {

    private final ChatLanguageModel chatLanguageModel;
    private final CustomerService customerService;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
            You are an expert financial analyst and customer support manager for a telecom company.
            Your task is to provide a DETAILED, professional summary of a customer's situation based on the data provided.
            You MUST return your response in a single, minified JSON object format. Do not use markdown (e.g., ```json).
            
            The JSON structure MUST be:
            {
              "riskLevel": "(String: 'Low', 'Medium', or 'High')",
              "executiveSummary": "(String: 1-2 sentence executive summary of the customer's overall situation)",
              "financials": {
                "totalBalance": "(String: Total combined balance from all accounts, e.g., '$9580.50')",
                "totalOverdueAmount": "(String: Total sum of all OVERDUE invoices, e.g., '$75.50' or '$0.00')",
                "accountStatusSummary": "(String: e.g., '1 of 2 accounts active' or '2 of 2 accounts active')"
              },
              "keyIssues": [
                "(String: A bullet point for the most critical issue, e.g., 'Invoice INV-009 ($75.50) is 8 days overdue.')",
                "(String: Another bullet point, e.g., 'Broadband account is INACTIVE with a $100.00 balance.')"
              ],
              "recentActivity": [
                "(String: Bullet point for the most recent dunning action, e.g., '2025-10-24: BPO_TASK_CREATED action executed.')",
                "(String: Bullet point for a recent notification, e.g., '2025-10-24: Notification sent via EMAIL.')"
              ]
            }
            
            Analyze the provided data to populate this structure. Be thorough and detailed in your analysis.
            """;

    @Override
    public AiAdminSummaryDto generateCustomerSummary(UUID customerId) {
        log.info("Generating AI summary for customer ID: {}", customerId);

        CustomerHistoryDto history = customerService.getCustomerDetailedHistory(customerId);
        String dataPrompt = formatHistoryForPrompt(history);
        String fullPrompt = SYSTEM_PROMPT + "\n\n--- CUSTOMER DATA ---\n" + dataPrompt;

        log.debug("Sending full prompt to AI for customer ID: {}", customerId);
        String rawResponse = chatLanguageModel.generate(fullPrompt);
        log.debug("Received raw response from AI: {}", rawResponse);

        // --- START FIX ---
        // Clean the response: Remove potential markdown fences and trim whitespace
        String cleanedJsonResponse = rawResponse.trim()
                .replaceFirst("^```json", "") // Remove starting ```json
                .replaceFirst("```$", "")       // Remove ending ```
                .trim();                       // Trim again after removing fences
        // --- END FIX ---

        log.debug("Cleaned JSON response: {}", cleanedJsonResponse);

        try {
            // Parse the CLEANED JSON string
            AiAdminSummaryDto summaryDto = objectMapper.readValue(cleanedJsonResponse, AiAdminSummaryDto.class);
            summaryDto.setCustomerId(customerId);
            log.info("Successfully parsed AI summary for customer ID: {}", customerId);
            return summaryDto;
        } catch (Exception e) {
            log.error("Failed to parse AI JSON response for customer {}. Error: {}. Cleaned response: {}", customerId, e.getMessage(), cleanedJsonResponse);
            // Return a fallback DTO on error
            return createErrorSummary(customerId, cleanedJsonResponse); // Pass cleaned response to error summary
        }
    }

    private AiAdminSummaryDto createErrorSummary(UUID customerId, String cleanedResponse) {
        AiAdminSummaryDto errorDto = new AiAdminSummaryDto();
        errorDto.setCustomerId(customerId);
        errorDto.setRiskLevel("Unknown");
        errorDto.setExecutiveSummary("Failed to generate AI summary. The AI returned an invalid format.");

        AiAdminSummaryDto.FinancialHighlight financials = new AiAdminSummaryDto.FinancialHighlight();
        financials.setTotalBalance("$0.00");
        financials.setTotalOverdueAmount("$0.00");
        financials.setAccountStatusSummary("N/A");
        errorDto.setFinancials(financials);

        errorDto.setKeyIssues(List.of("Error parsing AI response. See raw data in 'Recent Activity'."));
        errorDto.setRecentActivity(List.of("Cleaned AI Response: " + cleanedResponse)); // Show the cleaned response
        return errorDto;
    }

    // No changes needed to this method
    private String formatHistoryForPrompt(CustomerHistoryDto history) {
        // ... (rest of the method remains exactly the same) ...
        StringBuilder sb = new StringBuilder();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter dtft = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        CustomerDto profile = history.getCustomerProfile();
        sb.append("== Customer Profile ==\n");
        sb.append(String.format("- Name: %s\n", profile.getFullName()));
        if (profile.getCompanyName() != null && !profile.getCompanyName().isBlank()) {
            sb.append(String.format("- Company: %s\n", profile.getCompanyName()));
        }
        if (profile.getContactPerson() != null && !profile.getContactPerson().isBlank()) {
            sb.append(String.format("- Contact Person: %s\n", profile.getContactPerson()));
        }
        sb.append(String.format("- Email: %s\n", profile.getEmail()));
        sb.append(String.format("- Phone: %s\n", profile.getPhoneNumber()));
        sb.append("\n");

        sb.append("== Account Summary ==\n");
        long activeAccounts = history.getAccounts().stream().filter(a -> "ACTIVE".equals(String.valueOf(a.getStatus()))).count();
        BigDecimal totalBalance = history.getAccounts().stream()
                .map(AccountDto::getCurrentBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        sb.append(String.format("- Total Accounts: %d (%d Active)\n", history.getAccounts().size(), activeAccounts));
        sb.append(String.format("- Total Combined Balance: $%.2f\n", totalBalance.doubleValue()));
        history.getAccounts().forEach(acc ->
                sb.append(String.format("  - Acct %s (%s): %s, Balance $%.2f\n",
                        acc.getAccountNumber(), acc.getAccountType(), acc.getStatus(), acc.getCurrentBalance().doubleValue()))
        );
        sb.append("\n");

        sb.append("== Recent Invoices (Top 5 of " + history.getInvoices().size() + ") ==\n");
        history.getInvoices().stream().limit(5).forEach(inv ->
                sb.append(String.format("- %s: $%.2f, Due: %s, Status: %s %s\n",
                        inv.getInvoiceNumber(),
                        inv.getAmountDue().doubleValue(),
                        inv.getDueDate(),
                        inv.getStatus(),
                        (inv.getOverdueDays() != null && inv.getOverdueDays() > 0) ? "("+inv.getOverdueDays()+" days overdue)" : ""
                ))
        );
        sb.append("\n");

        sb.append("== Recent Payments (Top 5 of " + history.getPayments().size() + ") ==\n");
        history.getPayments().stream().limit(5).forEach(p ->
                sb.append(String.format("- $%s on %s, Status: %s, Method: %s\n",
                        p.getAmountPaid(),
                        p.getPaymentDate(),
                        p.getStatus(),
                        p.getPaymentMethod()
                ))
        );
        sb.append("\n");

        sb.append("== Recent Communications & Actions (Top 7) ==\n");
        List<String> notifications = history.getNotificationLogs().stream().limit(4)
                .map(log -> String.format("- %s [Notification]: %s sent. (Status: %s)",
                        log.getSentAt().format(dtft), log.getChannel(), log.getStatus()))
                .collect(Collectors.toList());

        List<String> dunningActions = history.getDunningActionLogs().stream().limit(3)
                .map(log -> String.format("- %s [Dunning Action]: %s executed.",
                        log.getCreatedAt().format(dtft), log.getActionType()))
                .collect(Collectors.toList());

        notifications.forEach(s -> sb.append(s).append("\n"));
        dunningActions.forEach(s -> sb.append(s).append("\n"));

        return sb.toString();
    }
}