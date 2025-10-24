package com.project.credflow.service.inter;
import com.project.credflow.model.User;

import java.util.UUID;

public interface PaymentService {
    void simulateMarkAsPaid(UUID invoiceId, String paymentMethodString);

    void manuallyCureCustomer(UUID customerId, User adminUser, String reason);
}