package com.project.credflow.service.inter;

import com.project.credflow.dto.AccountDto;
import com.project.credflow.dto.CustomerDto;
import com.project.credflow.dto.InvoiceDto;
import com.project.credflow.dto.PaymentDto;
import com.project.credflow.model.User;

import java.util.List;
import java.util.UUID;

public interface CustomerService {

    CustomerDto getCustomerProfile(User user);


    List<AccountDto> getCustomerAccounts(User user);


    List<InvoiceDto> getInvoicesForAccount(User user, UUID accountId);

    List<InvoiceDto> getAllCustomerInvoices(User user);

    List<PaymentDto> getPaymentsForInvoice(User user, UUID invoiceId);
}