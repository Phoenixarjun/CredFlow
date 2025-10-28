package com.project.credflow.service.impl;

// --- Standard Imports ---
import com.project.credflow.exception.ActionExecutionException;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.model.*;
import com.project.credflow.repository.*;
import com.project.credflow.service.inter.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

// --- Enum Imports ---
import com.project.credflow.enums.AccountStatus;
import com.project.credflow.enums.BpoTaskStatus;
import com.project.credflow.enums.BpoTaskPriority;
import com.project.credflow.enums.RuleActionType;

@Service
@RequiredArgsConstructor
@Slf4j
public class RuleActionServiceImpl implements RuleActionService {

    // --- Injected Services & Repositories ---
    private final AccountRepository accountRepository;
    private final EmailService emailService;
    private final SmsService smsService; // For SMS
    private final BpoTaskRepository bpoTaskRepository;
    private final DunningActionLogRepository dunningActionLogRepository;
    // Removed NotificationTemplateRepository - assuming EmailService handles template logic

    @Override
    @Transactional
    public void executeAction(DunningRule rule, Invoice invoice) {
        if (rule == null || invoice == null || rule.getActionType() == null) {
            log.warn("Cannot execute action: Rule, Invoice, or ActionType is null.");
            return;
        }

        RuleActionType actionType = rule.getActionType();
        log.info("Executing action: {} for rule: {} on invoice: {}",
                actionType, rule.getRuleName(), invoice.getInvoiceNumber());

        Account account = invoice.getAccount();
        if (account == null) {
            log.warn("Cannot execute action: Invoice {} has no associated account.", invoice.getInvoiceId());
            // --- Call original logAction on failure ---
            logAction(actionType, invoice.getInvoiceId());
            // ------------------------------------------
            return;
        }

        User user = getUserFromInvoice(invoice); // Get user safely

        try {
            switch (actionType) {
                case SEND_EMAIL:
                    if (rule.getTemplate() == null) {
                        log.warn("Cannot send email: Rule {} has no associated template object.", rule.getRuleName());
                        // --- Call original logAction on skip ---
                        logAction(actionType, invoice.getInvoiceId());
                        // ---------------------------------------
                        break;
                    }
                    emailService.sendDunningEmail(invoice, rule.getTemplate());
                    log.info("Email action initiated via Rule '{}' for Invoice '{}'.", rule.getRuleName(), invoice.getInvoiceNumber());
                    // --- Call original logAction on success ---
                    logAction(actionType, invoice.getInvoiceId());
                    // ----------------------------------------
                    break;

                case SEND_SMS:
                    handleSendSms(rule, invoice, user); // SMS logic remains
                    break;

                case CREATE_BPO_TASK:
                    handleCreateBpoTask(rule, invoice, account); // BPO logic remains
                    break;

                case RESTRICT_SERVICE:
                    handleRestrictService(rule, invoice, account); // Restrict logic remains
                    break;

                case THROTTLE_SPEED:
                    handleThrottleSpeed(rule, invoice, account); // Throttle logic remains
                    break;

                default:
                    log.warn("Unknown or unhandled action type: {}", actionType);
                    // --- Call original logAction on failure ---
                    logAction(actionType, invoice.getInvoiceId());
                    // ------------------------------------------
                    // No need to throw exception here if just logging
            }
        } catch (Exception e) {
            log.error("Error during execution of action {} for Rule '{}' on Invoice '{}': {}",
                    actionType, rule.getRuleName(), invoice.getInvoiceNumber(), e.getMessage(), e);
            // --- Call original logAction on failure ---
            logAction(actionType, invoice.getInvoiceId());
            // ------------------------------------------
            // Optionally re-throw
            // throw new ActionExecutionException("Wrapper exception for action failure", e);
        }
    }

    // --- SMS Handler (Uses Updated logAction) ---
    private void handleSendSms(DunningRule rule, Invoice invoice, User user) {
        RuleActionType actionType = rule.getActionType(); // Get action type for logging
        if (user == null || user.getPhoneNumber() == null || user.getPhoneNumber().isBlank()) {
            log.warn("Cannot send SMS for Rule '{}': User or user phone number not found/empty for Invoice '{}'.", rule.getRuleName(), invoice.getInvoiceNumber());
            logAction(actionType, invoice.getInvoiceId()); // Log skip/failure
            return;
        }

        NotificationTemplate template = rule.getTemplate();
        if (template == null) {
            log.error("Cannot send SMS for Rule '{}': Template object is missing.", rule.getRuleName());
            logAction(actionType, invoice.getInvoiceId()); // Log failure
            throw new ActionExecutionException("Template object is missing for SEND_SMS rule: " + rule.getRuleId());
        }

        String messageBody = processTemplate(template.getBody(), invoice, user);

        if (messageBody == null || messageBody.isBlank()) {
            log.error("Cannot send SMS for Rule '{}': Processed message body is empty.", rule.getRuleName());
            logAction(actionType, invoice.getInvoiceId()); // Log failure
            throw new ActionExecutionException("SMS message body is empty after processing for rule: " + rule.getRuleId());
        }

        String e164PhoneNumber = formatPhoneNumberE164(user.getPhoneNumber());
        if (e164PhoneNumber == null) {
            log.warn("Cannot send SMS for Rule '{}': Phone number '{}' could not be formatted to E.164.", rule.getRuleName(), user.getPhoneNumber());
            logAction(actionType, invoice.getInvoiceId()); // Log skip/failure
            return;
        }

        log.debug("Attempting to send SMS to {} for Invoice {}", e164PhoneNumber, invoice.getInvoiceNumber());
        boolean success = smsService.sendSms(e164PhoneNumber, messageBody);

        if (success) {
            log.info("SMS initiated successfully via Rule '{}' for Invoice '{}'.", rule.getRuleName(), invoice.getInvoiceNumber());
            logAction(actionType, invoice.getInvoiceId()); // Log success
        } else {
            logAction(actionType, invoice.getInvoiceId()); // Log failure (SmsService logged specifics)
            throw new ActionExecutionException("Failed to initiate SMS sending for rule: " + rule.getRuleId());
        }
    }


    // --- Other Action Handlers (Use Updated logAction) ---

    private void handleCreateBpoTask(DunningRule rule, Invoice invoice, Account account) {
        BpoTask newTask = new BpoTask();
        newTask.setCustomer(account.getCustomer());
        newTask.setInvoice(invoice);
        newTask.setStatus(BpoTaskStatus.NEW);
        BpoTaskPriority priority = rule.getBpoTaskPriority();
        if (priority == null) {
            log.warn("BPO Task Priority not set for Rule '{}'. Defaulting to MEDIUM.", rule.getRuleName());
            priority = BpoTaskPriority.MEDIUM;
        }
        newTask.setPriority(priority);
        String customerName = "Unknown Customer";
        if (account.getCustomer() != null && account.getCustomer().getUser() != null && account.getCustomer().getUser().getFullName() != null) {
            customerName = account.getCustomer().getUser().getFullName();
        }
        newTask.setTaskDescription(String.format(
                "Follow up on overdue invoice %s for %s.",
                invoice.getInvoiceNumber(), customerName
        ));
        BpoTask savedTask = bpoTaskRepository.save(newTask);
        log.info("Created new BPO Task with ID: {}", savedTask.getTaskId());
        logAction(rule.getActionType(), invoice.getInvoiceId()); // Use original signature
    }

    private void handleRestrictService(DunningRule rule, Invoice invoice, Account account) {
        log.warn("Executing RESTRICT_SERVICE for Account ID: {}", account.getAccountId());
        account.setStatus(AccountStatus.SUSPENDED);
        account.setCurrentSpeed("0 Mbps");
        accountRepository.save(account);
        log.info("Restricted account: {}. Status set to SUSPENDED, speed set to 0 Mbps.", account.getAccountNumber());
        logAction(rule.getActionType(), invoice.getInvoiceId()); // Use original signature
    }

    private void handleThrottleSpeed(DunningRule rule, Invoice invoice, Account account) {
        log.warn("Executing THROTTLE_SPEED for Account ID: {}", account.getAccountId());
        if (account.getStatus() == AccountStatus.ACTIVE || account.getStatus() == AccountStatus.THROTTLED) {
            account.setStatus(AccountStatus.THROTTLED);
            String throttleSpeed = "512 Kbps";
            account.setCurrentSpeed(throttleSpeed);
            accountRepository.save(account);
            log.info("Throttled account: {}. Status set to THROTTLED, speed set to {}.", account.getAccountNumber(), throttleSpeed);
            logAction(rule.getActionType(), invoice.getInvoiceId()); // Use original signature
        } else {
            log.info("Skipping throttle for account {}: Status is {}.", account.getAccountNumber(), account.getStatus());
            logAction(rule.getActionType(), invoice.getInvoiceId()); // Log skip/failure
        }
    }

    // --- Helper Methods (getUser, formatPhone, processTemplate) ---
    // These remain the same as the previous corrected version
    private User getUserFromInvoice(Invoice invoice) {
        try {
            if (invoice != null && invoice.getAccount() != null && invoice.getAccount().getCustomer() != null) {
                return invoice.getAccount().getCustomer().getUser();
            }
        } catch (Exception e) {
            log.error("Unexpected error retrieving User from Invoice {}: {}", invoice != null ? invoice.getInvoiceId() : "null", e.getMessage(), e);
        }
        log.warn("Could not retrieve User from Invoice {}: Missing Account, Customer, or User link.", invoice != null ? invoice.getInvoiceId() : "null");
        return null;
    }

    private String formatPhoneNumberE164(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank()) return null;
        String digits = phoneNumber.trim().replaceAll("[^\\d+]", "");
        if (digits.matches("^\\+\\d+$")) {
            digits = "+" + digits.substring(1).replaceAll("\\+", "");
            if (digits.length() > 10) return digits;
        } else {
            digits = phoneNumber.trim().replaceAll("[^\\d]", "");
            if (digits.length() == 10) {
                String countryCode = "+91"; // Make Configurable
                return countryCode + digits;
            } else if (digits.length() > 10) {
                return "+" + digits;
            }
        }
        log.warn("Could not reliably format phone number '{}' to E.164.", phoneNumber);
        return null;
    }

    private String processTemplate(String content, Invoice invoice, User user) {
        if (content == null) return "";
        Account account = invoice.getAccount();
        Customer customer = account != null ? account.getCustomer() : null; // Added safe access

        content = safeReplace(content,"{{invoiceNumber}}", invoice.getInvoiceNumber());
        content = safeReplace(content,"{{amountDue}}", invoice.getAmountDue() != null ? invoice.getAmountDue().toPlainString() : null);
        content = safeReplace(content,"{{dueDate}}", invoice.getDueDate() != null ? invoice.getDueDate().toString() : null);
        content = safeReplace(content,"{{userName}}", user != null ? user.getFullName() : null);
        content = safeReplace(content,"{{accountNumber}}", account != null ? account.getAccountNumber() : null);
        content = content.replace("{{userName}}", "Valued Customer");

        return content;
    }

    private String safeReplace(String text, String placeholder, String value) {
        return text.replace(placeholder, value != null ? value : "N/A");
    }

    /**
     * --- Reverted logAction Method ---
     * Logs the execution using the original simpler signature.
     * Assumes a constructor DunningActionLog(RuleActionType, UUID) exists.
     */
    private void logAction(RuleActionType actionType, UUID invoiceId) {
        try {
            DunningActionLog actionLog = new DunningActionLog(actionType, invoiceId);

            dunningActionLogRepository.save(actionLog);
            log.debug("Saved DunningActionLog: Type={}, Invoice={}", actionType, invoiceId);
        } catch (Exception e) {
            log.error("Failed to save DunningActionLog for action {} on invoice {}: {}", actionType, invoiceId, e.getMessage(), e);
        }
    }
    // ----------------------------------
}