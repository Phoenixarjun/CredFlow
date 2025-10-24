package com.project.credflow.service.impl;

import com.project.credflow.dto.*;
import com.project.credflow.exception.AuthException;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.mapper.*;
import com.project.credflow.model.*;
import com.project.credflow.repository.*;
import com.project.credflow.service.inter.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final DunningActionLogRepository dunningActionLogRepository;

    private final CustomerMapper customerMapper;
    private final AccountMapper accountMapper;
    private final InvoiceMapper invoiceMapper;
    private final PaymentMapper paymentMapper;
    private final NotificationLogMapper notificationLogMapper;
    private final DunningActionLogMapper dunningActionLogMapper;

    private Customer getCustomerFromPrincipal(User user) {
        return customerRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for the logged-in user."));
    }

    private Customer findCustomerById(UUID customerId) {
        return customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));
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
        return accounts.stream().map(accountMapper::toAccountDto).collect(Collectors.toList());
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
        return invoices.stream().map(invoiceMapper::toInvoiceDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDto> getAllCustomerInvoices(User user) {
        Customer customer = getCustomerFromPrincipal(user);
        List<Account> accounts = accountRepository.findByCustomer_CustomerId(customer.getCustomerId());
        List<Invoice> allInvoices = new ArrayList<>();
        for (Account account : accounts) {
            allInvoices.addAll(invoiceRepository.findByAccount_AccountId(account.getAccountId()));
        }
        allInvoices.sort((inv1, inv2) -> {
            if (inv1.getDueDate() == null && inv2.getDueDate() == null) return 0;
            if (inv1.getDueDate() == null) return 1;
            if (inv2.getDueDate() == null) return -1;
            return inv2.getDueDate().compareTo(inv1.getDueDate());
        });
        return allInvoices.stream().map(invoiceMapper::toInvoiceDto).collect(Collectors.toList());
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
        return payments.stream().map(paymentMapper::toPaymentDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerHistoryDto getCustomerDetailedHistory(UUID customerId) {
        log.info("Fetching detailed history for customer ID: {}", customerId);

        Customer customer = findCustomerById(customerId);
        CustomerDto customerDto = customerMapper.toCustomerDto(customer);

        List<Account> accounts = accountRepository.findByCustomer_CustomerId(customerId);
        List<AccountDto> accountDtos = accounts.stream()
                .map(accountMapper::toAccountDto)
                .collect(Collectors.toList());

        List<Invoice> allInvoices = new ArrayList<>();
        for (Account account : accounts) {
            allInvoices.addAll(invoiceRepository.findByAccount_AccountId(account.getAccountId()));
        }
        allInvoices.sort((inv1, inv2) -> {
            if (inv1.getDueDate() == null && inv2.getDueDate() == null) return 0;
            if (inv1.getDueDate() == null) return 1;
            if (inv2.getDueDate() == null) return -1;
            return inv2.getDueDate().compareTo(inv1.getDueDate());
        });
        List<InvoiceDto> invoiceDtos = allInvoices.stream()
                .map(invoiceMapper::toInvoiceDto)
                .collect(Collectors.toList());

        List<Payment> allPayments = new ArrayList<>();
        for (Invoice invoice : allInvoices) {
            allPayments.addAll(paymentRepository.findByInvoice_InvoiceId(invoice.getInvoiceId()));
        }
        allPayments.sort((p1, p2) -> {
            if (p1.getCreatedAt() == null && p2.getCreatedAt() == null) return 0;
            if (p1.getCreatedAt() == null) return 1;
            if (p2.getCreatedAt() == null) return -1;
            return p2.getCreatedAt().compareTo(p1.getCreatedAt());
        });
        List<PaymentDto> paymentDtos = allPayments.stream()
                .map(paymentMapper::toPaymentDto)
                .collect(Collectors.toList());

        List<NotificationLog> notificationLogs = notificationLogRepository.findByCustomerOrderBySentAtDesc(customer);
        List<NotificationLogDto> notificationLogDtos = notificationLogMapper.toNotificationLogDtoList(notificationLogs);

        List<DunningActionLog> dunningActionLogs = dunningActionLogRepository.findByCustomer(customerId);
        List<DunningActionLogDto> dunningActionLogDtos = dunningActionLogMapper.toDunningActionLogDtoList(dunningActionLogs);

        return new CustomerHistoryDto(
                customerDto,
                accountDtos,
                invoiceDtos,
                paymentDtos,
                notificationLogDtos,
                dunningActionLogDtos
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerDto> searchCustomers(String query) {
        log.info("Searching customers with query: '{}'", query);
        if (query == null || query.trim().isEmpty()) {
            return List.of(); // Return empty list for blank query
        }
        String trimmedQuery = query.trim();

        // Search across multiple fields
        List<Customer> byName = customerRepository.findByUser_FullNameContainingIgnoreCase(trimmedQuery);
        List<Customer> byEmail = customerRepository.findByUser_EmailContainingIgnoreCase(trimmedQuery);
        List<Customer> byPhone = customerRepository.findByUser_PhoneNumberContaining(trimmedQuery);

        // Search by account number requires fetching accounts first, then their customers
        List<Account> accountsByNumber = accountRepository.findByAccountNumberContainingIgnoreCase(trimmedQuery);
        List<Customer> byAccountNumber = accountsByNumber.stream()
                .map(Account::getCustomer)
                .distinct() // Avoid duplicates if customer has multiple matching accounts
                .collect(Collectors.toList());

        // Combine results, remove duplicates based on customerId, and map to DTOs
        List<CustomerDto> results = Stream.of(byName, byEmail, byPhone, byAccountNumber)
                .flatMap(List::stream) // Flatten the lists into one stream
                .distinct() // Ensure each customer appears only once
                .sorted(Comparator.comparing(c -> c.getUser().getFullName())) // Sort by name
                .map(customerMapper::toCustomerDto) // Map to DTO
                .collect(Collectors.toList());

        log.info("Found {} customers matching query '{}'", results.size(), trimmedQuery);
        return results;
    }
}