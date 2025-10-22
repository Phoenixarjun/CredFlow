package com.project.credflow.service.impl;

import com.project.credflow.enums.AccountStatus;
import com.project.credflow.enums.InvoiceStatus;
import com.project.credflow.enums.PaymentMethod;
import com.project.credflow.enums.PaymentStatus;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.model.Account;
import com.project.credflow.model.Invoice;
import com.project.credflow.model.Payment;
import com.project.credflow.model.Plan;
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.repository.InvoiceRepository;
import com.project.credflow.repository.PaymentRepository;
import com.project.credflow.service.inter.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final AccountRepository accountRepository;

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

        // --- Simulate Processing Delay ---
        try {
            log.debug("Simulating payment processing delay...");
            TimeUnit.SECONDS.sleep(2); // Simulate 2 seconds processing
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
                    account.setCurrentSpeed(plan.getDefaultSpeed()); // Restore to default speed
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
}