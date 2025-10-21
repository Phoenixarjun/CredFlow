package com.project.credflow.service.inter;

import java.util.UUID;

public interface PaymentService {
    void simulateMarkAsPaid(UUID invoiceId, String paymentMethodString);
}