package com.project.credflow.controller;

import com.project.credflow.service.inter.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class PaymentController {

    private final PaymentService paymentService; // Inject the service


    @PostMapping("/invoices/{invoiceId}/mark-paid")
    public ResponseEntity<Map<String, String>> markInvoiceAsPaid(
            @PathVariable UUID invoiceId,
            @RequestParam(required = false, defaultValue = "OTHER") String method) { // Get method from query param
        try {
            paymentService.simulateMarkAsPaid(invoiceId, method);
            return ResponseEntity.ok(Map.of("message", "Payment simulated successfully. Invoice marked as paid."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error processing simulated payment: " + e.getMessage()));
        }
    }
}