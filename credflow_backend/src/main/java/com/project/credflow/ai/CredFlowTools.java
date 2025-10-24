package com.project.credflow.ai;

import com.project.credflow.dto.AccountDto;
import com.project.credflow.dto.InvoiceDto;
import com.project.credflow.dto.PlanDto;
import com.project.credflow.model.User;
import com.project.credflow.service.inter.CustomerApiService;
import dev.langchain4j.agent.tool.Tool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CredFlowTools {

    private final CustomerApiService customerApiService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof User)) {
            log.error("AI Tool: Could not retrieve authenticated user from SecurityContext.");
            throw new IllegalStateException("User not authenticated.");
        }
        return (User) authentication.getPrincipal();
    }

    @Tool("Fetches a summary of the current customer's invoices including overdue status")
    public String getCurrentUserInvoiceSummary() {
        log.info("AI Tool: Executing getCurrentUserInvoiceSummary");
        try {
            User currentUser = getCurrentUser();
            List<InvoiceDto> invoices = customerApiService.getCurrentUserInvoices(currentUser);

            if (invoices == null || invoices.isEmpty()) {
                return "You currently have no invoices on record.";
            }

            long overdueCount = invoices.stream()
                    .filter(inv -> "OVERDUE".equals(inv.getStatus().name()))
                    .count();

            // ✅ FIX: Handle BigDecimal correctly
            BigDecimal totalDue = invoices.stream()
                    .map(InvoiceDto::getAmountDue)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String overdueMsg = overdueCount > 0
                    ? String.format(" %d of which are OVERDUE.", overdueCount)
                    : "";

            StringBuilder summary = new StringBuilder();
            summary.append(String.format("You have %d invoices with a total balance of $%.2f.%s\n\n",
                    invoices.size(), totalDue.doubleValue(), overdueMsg));

            summary.append("Latest invoices:\n");
            invoices.stream()
                    .limit(5)
                    .forEach(inv -> summary.append(String.format(
                            "• Invoice %s: $%.2f due on %s [%s]\n",
                            inv.getInvoiceNumber(),
                            inv.getAmountDue().doubleValue(), // ✅ Convert to double
                            inv.getDueDate(),
                            inv.getStatus().name()
                    )));

            return summary.toString();

        } catch (IllegalStateException e) {
            log.warn("AI Tool: Invoice summary failed - user not authenticated.");
            return "I cannot fetch invoices as you don't seem to be logged in.";
        } catch (Exception e) {
            log.error("AI Tool: Error fetching invoice data", e);
            return "Sorry, I encountered an error trying to fetch your invoice data.";
        }
    }

    @Tool("Fetches the current customer's active plan details")
    public String getCurrentUserPlanDetails() {
        log.info("AI Tool: Executing getCurrentUserPlanDetails");
        try {
            User currentUser = getCurrentUser();
            PlanDto plan = customerApiService.getCurrentUserPlan(currentUser);

            if (plan == null) {
                return "I couldn't find an active plan associated with your account.";
            }

            // ✅ FIX: Handle BigDecimal price
            return String.format("Your current plan is '%s'. It's a %s plan costing $%.2f per month.",
                    plan.getPlanName(),
                    plan.getPlanType(),
                    plan.getPrice().doubleValue());

        } catch (IllegalStateException e) {
            log.warn("AI Tool: Plan details failed - user not authenticated.");
            return "I cannot fetch plan details as you don't seem to be logged in.";
        } catch (Exception e) {
            log.error("AI Tool: Error fetching plan data", e);
            return "Sorry, I encountered an error trying to fetch your plan data.";
        }
    }

    @Tool("Fetches a summary of the current customer's account statuses and balances")
    public String getCurrentUserAccountSummary() {
        log.info("AI Tool: Executing getCurrentUserAccountSummary");
        try {
            User currentUser = getCurrentUser();
            List<AccountDto> accounts = customerApiService.getCurrentUserAccounts(currentUser);

            if (accounts == null || accounts.isEmpty()) {
                return "You do not have any accounts associated with your profile.";
            }

            return "Here's a summary of your accounts:\n" +
                    accounts.stream()
                            .map(acc -> String.format("- Account %s (%s): Status %s, Balance $%.2f",
                                    acc.getAccountNumber(),
                                    acc.getAccountType(),
                                    acc.getStatus(),
                                    acc.getCurrentBalance().doubleValue())) // ✅ Convert to double
                            .collect(Collectors.joining("\n"));

        } catch (IllegalStateException e) {
            log.warn("AI Tool: Account summary failed - user not authenticated.");
            return "I cannot fetch account details as you don't seem to be logged in.";
        } catch (Exception e) {
            log.error("AI Tool: Error fetching account data", e);
            return "Sorry, I encountered an error trying to fetch your account data.";
        }
    }
}