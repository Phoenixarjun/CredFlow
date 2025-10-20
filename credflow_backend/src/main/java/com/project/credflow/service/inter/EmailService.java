package com.project.credflow.service.inter;

import com.project.credflow.model.Invoice;
import com.project.credflow.model.NotificationTemplate;

public interface EmailService {
    void sendDunningEmail(Invoice invoice, NotificationTemplate template);
}