package com.project.credflow.service.impl;

import com.project.credflow.dto.AccountDto;
import com.project.credflow.dto.CustomerDto;
import com.project.credflow.dto.InvoiceDto;
import com.project.credflow.dto.PaymentDto;
import com.project.credflow.exception.AuthException;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.mapper.AccountMapper;
import com.project.credflow.mapper.CustomerMapper;
import com.project.credflow.mapper.InvoiceMapper;
import com.project.credflow.mapper.PaymentMapper;
import com.project.credflow.model.*;
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.repository.CustomerRepository;
import com.project.credflow.repository.InvoiceRepository;
import com.project.credflow.repository.PaymentRepository;
import com.project.credflow.service.inter.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;

    private final CustomerMapper customerMapper;
    private final AccountMapper accountMapper;
    private final InvoiceMapper invoiceMapper;
    private final PaymentMapper paymentMapper;


    private Customer getCustomerFromPrincipal(User user) {
        return customerRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for the logged-in user."));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDto getCustomerProfile(User user) {
        Customer customer = getCustomerFromPrincipal(user);
        return customerMapper.toCustomerDto(customer);
    }


    @Override
    @Transactional(readOnly = true)
    public List<AccountDto> getCustomerAccounts(User user) {
        Customer customer = getCustomerFromPrincipal(user);
        List<Account> accounts = accountRepository.findByCustomer_CustomerId(customer.getCustomerId());

        return accounts.stream()
                .map(accountMapper::toAccountDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDto> getInvoicesForAccount(User user, UUID accountId) {
        Customer customer = getCustomerFromPrincipal(user);

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));

        if(!account.getCustomer().getCustomerId().equals(customer.getCustomerId())){
            throw new AuthException("Access Denied: You do not own this account.");
        }

        List<Invoice> invoices = invoiceRepository.findByAccount_AccountId(accountId);

        return invoices.stream()
                .map(invoiceMapper::toInvoiceDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentDto> getPaymentsForInvoice(User user, UUID invoiceId) {
        Customer customer = getCustomerFromPrincipal(user);

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + invoiceId));

        if (!invoice.getAccount().getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new AuthException("Access Denied: You do not own this invoice.");
        }

        List<Payment> payments = paymentRepository.findByInvoice_InvoiceId(invoiceId);
        return payments.stream()
                .map(paymentMapper::toPaymentDto)
                .collect(Collectors.toList());

    }
}
