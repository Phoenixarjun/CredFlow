package com.project.credflow.service.impl;

import com.project.credflow.enums.AccountStatus;
import com.project.credflow.enums.InvoiceStatus;
import com.project.credflow.enums.PaymentMethod;
import com.project.credflow.enums.PaymentStatus;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.model.*;
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.repository.CustomerRepository;
import com.project.credflow.repository.InvoiceRepository;
import com.project.credflow.repository.PaymentRepository;
import com.project.credflow.service.inter.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public void simulateMarkAsPaid(UUID invoiceId, String paymentMethodString) {
        log.info("Simulating payment for invoice ID: {} using method: {}", invoiceId, paymentMethodString);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            log.warn("Invoice {} is already paid.", invoiceId);
            throw new IllegalStateException("Invoice is already paid.");
        }

        try {
            log.debug("Simulating payment processing delay...");
            TimeUnit.SECONDS.sleep(2);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Payment simulation delay interrupted", e);
            throw new RuntimeException("Payment simulation interrupted", e);
        }
        invoice.setStatus(InvoiceStatus.PAID);
        invoiceRepository.save(invoice);
        log.info("Updated invoice {} status to PAID", invoiceId);

        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmountPaid(invoice.getAmountDue());
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(PaymentStatus.SUCCESS);

        try {
            PaymentMethod method = PaymentMethod.valueOf(paymentMethodString.toUpperCase());
            payment.setPaymentMethod(method);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid payment method string '{}'. Defaulting to OTHER.", paymentMethodString);
            payment.setPaymentMethod(PaymentMethod.OTHER);
        }
        payment.setTransactionRef("SIMULATED-" + UUID.randomUUID().toString().substring(0, 8));

        paymentRepository.save(payment);
        log.info("Created simulated payment record for invoice {}", invoiceId);

        Account account = invoice.getAccount();
        if (account != null) {
            BigDecimal newBalance = account.getCurrentBalance().subtract(payment.getAmountPaid());
            account.setCurrentBalance(newBalance);
            accountRepository.save(account);
            log.info("Updated account {} balance to {}", account.getAccountNumber(), newBalance);

            cureAccountIfApplicable(account);

        } else {
            log.warn("Invoice {} has no associated account. Balance not updated.", invoiceId);
        }
    }

    private void cureAccountIfApplicable(Account account) {
        if (account.getStatus() == AccountStatus.THROTTLED ||
                account.getStatus() == AccountStatus.SUSPENDED) {

            log.info("Account {} is in a non-active state. Checking if curing is needed...", account.getAccountNumber());

            long overdueCount = invoiceRepository.countByAccountAndStatus(account, InvoiceStatus.OVERDUE);

            if (overdueCount == 0) {
                Plan plan = account.getPlan();
                if (plan != null) {
                    log.info("Curing account {}: No overdue invoices found. Restoring services.", account.getAccountNumber());
                    account.setStatus(AccountStatus.ACTIVE);
                    account.setCurrentSpeed(plan.getDefaultSpeed());
                    accountRepository.save(account);
                    log.info("Account {} cured. Status set to ACTIVE, speed set to {}.",
                            account.getAccountNumber(), plan.getDefaultSpeed());
                } else {
                    log.warn("Account {} has no overdue invoices, but cannot be cured: No plan assigned.", account.getAccountNumber());
                }
            } else {
                log.info("Account {} not cured. {} overdue invoices still remain.", account.getAccountNumber(), overdueCount);
            }
        }
    }

    @Override
    @Transactional
    public void manuallyCureCustomer(UUID customerId, User adminUser, String reason) {
        log.warn("ADMIN ACTION: Attempting manual cure for customer ID: {} by Admin: {} (Reason: {})",
                customerId, adminUser.getEmail(), reason);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Cannot perform manual cure: Customer not found with ID: " + customerId));

        List<Account> accounts = accountRepository.findByCustomer_CustomerId(customerId);
        if (accounts.isEmpty()) {
            log.warn("Manual cure for customer {} had no effect: No accounts found.", customerId);
            return;
        }

        int curedCount = 0;
        for (Account account : accounts) {
            if (account.getStatus() == AccountStatus.THROTTLED || account.getStatus() == AccountStatus.SUSPENDED) {
                Plan plan = account.getPlan();
                if (plan != null) {
                    account.setStatus(AccountStatus.ACTIVE);
                    account.setCurrentSpeed(plan.getDefaultSpeed());
                    accountRepository.save(account);
                    log.warn("ADMIN ACTION: Manually cured Account {}. Status set to ACTIVE, speed restored to {}. Performed by: {}. Reason: {}",
                            account.getAccountNumber(), plan.getDefaultSpeed(), adminUser.getEmail(), reason);
                    curedCount++;
                } else {
                    log.error("ADMIN ACTION FAILED for Account {}: Cannot manually cure - Account has no plan assigned to determine default speed.", account.getAccountNumber());
                }
            }
        }

        if (curedCount == 0) {
            log.info("Manual cure requested for customer {}, but no accounts were in a THROTTLED or SUSPENDED state.", customerId);
        } else {
            log.warn("ADMIN ACTION Completed: Manually cured {} account(s) for customer {}. Performed by: {}",
                    curedCount, customerId, adminUser.getEmail());
        }
        // TODO: Consider adding an entry to a dedicated AdminActionLog table here for better auditing.
    }
}