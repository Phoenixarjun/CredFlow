package com.project.credflow.service.impl;

import com.project.credflow.enums.InvoiceStatus;
import com.project.credflow.enums.PaymentMethod;
import com.project.credflow.enums.PaymentStatus;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.model.Invoice;
import com.project.credflow.model.Payment;
import com.project.credflow.repository.InvoiceRepository;
import com.project.credflow.repository.PaymentRepository;
import com.project.credflow.service.inter.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j // Using Slf4j for logging
public class PaymentServiceImpl implements PaymentService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public void simulateMarkAsPaid(UUID invoiceId, String paymentMethodString) {
        log.info("Simulating payment for invoice ID: {} using method: {}", invoiceId, paymentMethodString);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            log.warn("Invoice {} is already paid.", invoiceId);
            // Optionally throw an exception or just return
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
        // --------------------------------

        // Update Invoice Status
        invoice.setStatus(InvoiceStatus.PAID);
        invoiceRepository.save(invoice);
        log.info("Updated invoice {} status to PAID", invoiceId);

        // Create Payment Record
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmountPaid(invoice.getAmountDue()); // Assume full amount paid
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(PaymentStatus.SUCCESS); // Mark payment as completed

        // Safely parse the payment method string to enum
        try {
            PaymentMethod method = PaymentMethod.valueOf(paymentMethodString.toUpperCase());
            payment.setPaymentMethod(method);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid payment method string '{}'. Defaulting to OTHER.", paymentMethodString);
            payment.setPaymentMethod(PaymentMethod.OTHER); // Defaults instead of crashing
        }
        payment.setTransactionRef("SIMULATED-" + UUID.randomUUID().toString().substring(0, 8));

        paymentRepository.save(payment);
        log.info("Created simulated payment record for invoice {}", invoiceId);

        // TODO: Update Account Balance (Phase X)
        // Account account = invoice.getAccount();
        // account.setCurrentBalance(account.getCurrentBalance().subtract(payment.getAmountPaid()));
        // accountRepository.save(account);
    }
}