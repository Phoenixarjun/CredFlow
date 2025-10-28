package com.project.credflow.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;


@Data
public class AiAdminSummaryDto {

    private UUID customerId;

    // 1. Overall Assessment
    private String riskLevel; // e.g., "High", "Medium", "Low"
    private String executiveSummary; // 1-2 sentence overview

    // 2. Financials
    private FinancialHighlight financials;

    // 3. Key Issues (as bullet points)
    private List<String> keyIssues;

    // 4. Recent Activity (as bullet points)
    private List<String> recentActivity;

    /**
     * Nested DTO for financial highlights.
     */
    @Data
    public static class FinancialHighlight {
        private String totalBalance; // e.g., "$9580.50"
        private String totalOverdueAmount; // e.g., "$75.50"
        private String accountStatusSummary; // e.g., "1 of 2 accounts active"
    }
}