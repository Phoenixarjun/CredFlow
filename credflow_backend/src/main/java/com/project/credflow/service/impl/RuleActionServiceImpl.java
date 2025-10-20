package com.project.credflow.service.impl;

import com.project.credflow.model.Account;
import com.project.credflow.model.DunningRule;
import com.project.credflow.model.Invoice;
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.service.inter.RuleActionService;
import com.project.credflow.enums.AccountStatus;
import com.project.credflow.service.inter.EmailService; // <-- ** 1. IMPORT EmailService **
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// ...

@Service
@RequiredArgsConstructor
public class RuleActionServiceImpl implements RuleActionService {

    private static final Logger log = LoggerFactory.getLogger(RuleActionServiceImpl.class);

    // --- Inject repositories and services ---
    private final AccountRepository accountRepository;
    private final EmailService emailService; // <-- ** 2. INJECT EmailService **
    // private final BpoTaskRepository bpoTaskRepository; // Still commented out

    @Override
    @Transactional
    public void executeAction(DunningRule rule, Invoice invoice) {
        log.info("Executing action: {} for rule: {} on invoice: {}",
                rule.getActionType(), rule.getRuleName(), invoice.getInvoiceNumber());

        switch (rule.getActionType()) {
            case SEND_EMAIL:
                if (rule.getTemplate() == null) {
                    log.warn("Cannot send email: Rule {} has no associated template.", rule.getRuleName());
                    break;
                }
                // <-- ** 3. UNCOMMENT AND CALL EmailService **
                emailService.sendDunningEmail(invoice, rule.getTemplate());
                break;

            case CREATE_BPO_TASK:
                log.warn("BPO Task logic not yet implemented. Skipping CREATE_BPO_TASK action.");
                break;

            case RESTRICT_SERVICE:
                Account account = invoice.getAccount();
                if (account != null) {
                    account.setStatus(AccountStatus.RESTRICTED);
                    accountRepository.save(account);
                    log.info("Restricted account: {}", account.getAccountNumber());
                } else {
                    log.warn("Cannot restrict service: Invoice {} has no associated account.", invoice.getInvoiceId());
                }
                break;

            default:
                log.warn("Unknown or unhandled action type: {}", rule.getActionType());
        }
    }
}