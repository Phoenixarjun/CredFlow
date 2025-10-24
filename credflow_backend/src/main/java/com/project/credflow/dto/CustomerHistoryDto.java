package com.project.credflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerHistoryDto {
    private CustomerDto customerProfile;
    private List<AccountDto> accounts;
    private List<InvoiceDto> invoices; // All invoices for this customer
    // Note: Payments might be numerous, consider fetching them per invoice on demand if needed
    // For now, let's fetch all related payments
    private List<PaymentDto> payments; // All payments linked to the customer's invoices
    private List<NotificationLogDto> notificationLogs;
    private List<DunningActionLogDto> dunningActionLogs;
}