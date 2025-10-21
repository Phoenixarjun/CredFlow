package com.project.credflow.service.impl;

import com.project.credflow.enums.AccountStatus;
import com.project.credflow.enums.BpoTaskStatus;
import com.project.credflow.model.Account;
import com.project.credflow.model.BpoTask;
import com.project.credflow.model.DunningRule;
import com.project.credflow.model.Invoice;
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.repository.BpoTaskRepository;
import com.project.credflow.service.inter.EmailService;
import com.project.credflow.service.inter.RuleActionService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RuleActionServiceImpl implements RuleActionService {

    private static final Logger log = LoggerFactory.getLogger(RuleActionServiceImpl.class);

    private final AccountRepository accountRepository;
    private final EmailService emailService;
    private final BpoTaskRepository bpoTaskRepository;

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
                emailService.sendDunningEmail(invoice, rule.getTemplate());
                break;

            case CREATE_BPO_TASK:
                // ** 3. UNCOMMENT AND UPDATE THIS BLOCK **
                BpoTask newTask = new BpoTask();
                newTask.setCustomer(invoice.getAccount().getCustomer());
                newTask.setInvoice(invoice);
                newTask.setStatus(BpoTaskStatus.NEW);
                newTask.setPriority(rule.getBpoTaskPriority());
                newTask.setTaskDescription(String.format(
                        "Follow up on overdue invoice %s for %s.",
                        invoice.getInvoiceNumber(),
                        invoice.getAccount().getCustomer().getUser().getFullName()
                ));

                bpoTaskRepository.save(newTask);
                log.info("Created new BPO Task with ID: {}", newTask.getTaskId());
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