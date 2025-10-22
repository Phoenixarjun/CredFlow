package com.project.credflow.service.impl;

import com.project.credflow.enums.AccountStatus;
import com.project.credflow.enums.BpoTaskStatus;
import com.project.credflow.enums.RuleActionType; // 1. IMPORT
import com.project.credflow.model.*; // 2. IMPORT (or be specific)
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.repository.BpoTaskRepository;
import com.project.credflow.repository.DunningActionLogRepository; // 3. IMPORT NEW REPO
import com.project.credflow.service.inter.EmailService;
import com.project.credflow.service.inter.RuleActionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID; // 4. IMPORT UUID

@Service
@RequiredArgsConstructor
public class RuleActionServiceImpl implements RuleActionService {

    private static final Logger log = LoggerFactory.getLogger(RuleActionServiceImpl.class);

    private final AccountRepository accountRepository;
    private final EmailService emailService;
    private final BpoTaskRepository bpoTaskRepository;
    private final DunningActionLogRepository dunningActionLogRepository; // 5. INJECT NEW REPO

    @Override
    @Transactional
    public void executeAction(DunningRule rule, Invoice invoice) {
        log.info("Executing action: {} for rule: {} on invoice: {}",
                rule.getActionType(), rule.getRuleName(), invoice.getInvoiceNumber());

        Account account = invoice.getAccount();
        if (account == null) {
            log.warn("Cannot execute action: Invoice {} has no associated account.", invoice.getInvoiceId());
            return;
        }

        switch (rule.getActionType()) {
            case SEND_EMAIL:
                if (rule.getTemplate() == null) {
                    log.warn("Cannot send email: Rule {} has no associated template.", rule.getRuleName());
                    break;
                }
                emailService.sendDunningEmail(invoice, rule.getTemplate());
                logAction(rule.getActionType(), invoice.getInvoiceId()); // 6. LOG ACTION
                break;

            case CREATE_BPO_TASK:
                BpoTask newTask = new BpoTask();
                newTask.setCustomer(account.getCustomer());
                newTask.setInvoice(invoice);
                newTask.setStatus(BpoTaskStatus.NEW);
                newTask.setPriority(rule.getBpoTaskPriority());
                newTask.setTaskDescription(String.format(
                        "Follow up on overdue invoice %s for %s.",
                        invoice.getInvoiceNumber(),
                        account.getCustomer().getUser().getFullName()
                ));
                bpoTaskRepository.save(newTask);
                logAction(rule.getActionType(), invoice.getInvoiceId()); // 7. LOG ACTION
                log.info("Created new BPO Task with ID: {}", newTask.getTaskId());
                break;

            case RESTRICT_SERVICE:
                log.warn("Executing RESTRICT_SERVICE for Account ID: {}", account.getAccountId());
                account.setStatus(AccountStatus.SUSPENDED);
                account.setCurrentSpeed("0mbps");
                accountRepository.save(account);
                logAction(rule.getActionType(), invoice.getInvoiceId()); // 8. LOG ACTION
                log.info("Restricted account: {}. Status set to SUSPENDED, speed set to 0mbps.", account.getAccountNumber());
                break;

            case THROTTLE_SPEED:
                try {
                    log.warn("Executing THROTTLE_SPEED for Account ID: {}", account.getAccountId());
                    if (account.getStatus() != AccountStatus.SUSPENDED) {
                        account.setStatus(AccountStatus.THROTTLED);
                        account.setCurrentSpeed("512kbps");
                        accountRepository.save(account);
                        logAction(rule.getActionType(), invoice.getInvoiceId()); // 9. LOG ACTION
                        log.info("Throttled account: {}. Status set to THROTTLED, speed set to 512kbps.", account.getAccountNumber());
                    } else {
                        log.info("Skipping throttle, account {} is already suspended.", account.getAccountNumber());
                    }
                } catch (Exception e) {
                    log.error("Failed to execute THROTTLE_SPEED action for invoice {}: {}",
                            invoice.getInvoiceNumber(), e.getMessage());
                }
                break;

            default:
                log.warn("Unknown or unhandled action type: {}", rule.getActionType());
        }
    }


    private void logAction(RuleActionType actionType, UUID invoiceId) {
        DunningActionLog actionLog = new DunningActionLog(actionType, invoiceId);
        dunningActionLogRepository.save(actionLog);
    }
}