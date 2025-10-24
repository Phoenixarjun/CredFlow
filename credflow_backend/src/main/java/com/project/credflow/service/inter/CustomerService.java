package com.project.credflow.service.inter;

import com.project.credflow.dto.*;
import com.project.credflow.model.User;

import java.util.List;
import java.util.UUID;

public interface CustomerService {

    CustomerDto getCustomerProfile(User user);


    List<AccountDto> getCustomerAccounts(User user);


    List<InvoiceDto> getInvoicesForAccount(User user, UUID accountId);

    List<InvoiceDto> getAllCustomerInvoices(User user);

    List<PaymentDto> getPaymentsForInvoice(User user, UUID invoiceId);

    CustomerHistoryDto getCustomerDetailedHistory(UUID customerId);

    List<CustomerDto> searchCustomers(String query);
}