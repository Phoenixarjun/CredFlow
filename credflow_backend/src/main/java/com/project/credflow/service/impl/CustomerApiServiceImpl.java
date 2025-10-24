package com.project.credflow.service.impl;

import com.project.credflow.dto.AccountDto;
import com.project.credflow.dto.InvoiceDto;
import com.project.credflow.dto.PlanDto;
import com.project.credflow.mapper.AccountMapper;
import com.project.credflow.mapper.InvoiceMapper;
import com.project.credflow.mapper.PlanMapper;
import com.project.credflow.model.Account;
import com.project.credflow.model.Customer;
import com.project.credflow.model.Invoice;
import com.project.credflow.model.User;
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.repository.CustomerRepository;
import com.project.credflow.repository.InvoiceRepository;
import com.project.credflow.service.inter.CustomerApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException; // Ensure this import is present
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID; // Ensure UUID import
import java.util.stream.Collectors;

@Service // Marks this as a Spring service bean
@RequiredArgsConstructor // Automatically creates constructor for final fields
@Slf4j // Provides a logger instance
public class CustomerApiServiceImpl implements CustomerApiService {

    // Inject required repositories and mappers via constructor
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final PlanMapper planMapper; // Assumes PlanMapper exists
    private final AccountMapper accountMapper; // Assumes AccountMapper exists

    /**
     * Helper method to retrieve the Customer entity associated with the authenticated User.
     * Throws AccessDeniedException if no customer profile is found for the user.
     *
     * @param currentUser The authenticated User object.
     * @return The corresponding Customer entity.
     */
    private Customer getCustomerFromUser(User currentUser) {
        return customerRepository.findByUser_UserId(currentUser.getUserId())
                .orElseThrow(() -> {
                    log.warn("No customer profile found for user ID: {}", currentUser.getUserId());
                    // Use AccessDeniedException for security context
                    return new AccessDeniedException("Customer profile not found for the authenticated user.");
                });
    }

    /**
     * Fetches all invoices linked to the accounts of the currently authenticated customer.
     *
     * @param currentUser The authenticated customer user.
     * @return A list of InvoiceDto, sorted by due date descending. Returns an empty list if no accounts or invoices are found.
     */
    @Override
    @Transactional(readOnly = true) // Read-only transaction for fetching data
    public List<InvoiceDto> getCurrentUserInvoices(User currentUser) {
        Customer customer = getCustomerFromUser(currentUser);
        log.debug("Fetching invoices for customer ID: {}", customer.getCustomerId());

        // Find all accounts associated with the customer
        List<Account> accounts = accountRepository.findByCustomer_CustomerId(customer.getCustomerId());
        if (accounts.isEmpty()) {
            log.info("No accounts found for customer ID: {}", customer.getCustomerId());
            return Collections.emptyList(); // Return empty list if no accounts
        }

        // Extract account IDs
        List<UUID> accountIds = accounts.stream().map(Account::getAccountId).collect(Collectors.toList());
        log.debug("Found account IDs for customer: {}", accountIds);

        // Fetch invoices associated with these account IDs, ordered by due date
        List<Invoice> invoices = invoiceRepository.findByAccountAccountIdInOrderByDueDateDesc(accountIds);
        log.info("Fetched {} invoices for customer ID: {}", invoices.size(), customer.getCustomerId());

        // Map the Invoice entities to InvoiceDto objects
        // Assumes invoiceMapper has a method like toInvoiceDto for single objects
        return invoices.stream()
                .map(invoiceMapper::toInvoiceDto)
                .collect(Collectors.toList());
    }

    /**
     * Fetches the active plan details for the currently authenticated customer.
     * It prioritizes the plan from the first ACTIVE account found, otherwise takes the plan
     * from the first account that has one.
     *
     * @param currentUser The authenticated customer user.
     * @return PlanDto containing the plan details, or null if no account with a plan is found.
     */
    @Override
    @Transactional(readOnly = true)
    public PlanDto getCurrentUserPlan(User currentUser) {
        Customer customer = getCustomerFromUser(currentUser);
        log.debug("Fetching plan for customer ID: {}", customer.getCustomerId());

        List<Account> accounts = accountRepository.findByCustomer_CustomerId(customer.getCustomerId());

        // Find the first ACTIVE account with a non-null plan
        Optional<Account> primaryAccountOpt = accounts.stream()
                .filter(acc -> acc.getPlan() != null) // Account must have a plan
                .filter(acc -> "ACTIVE".equals(acc.getStatus().name())) // Prioritize ACTIVE status
                .findFirst()
                .or(() -> accounts.stream() // Fallback: find any account with a plan
                        .filter(acc -> acc.getPlan() != null)
                        .findFirst());

        if (primaryAccountOpt.isPresent() && primaryAccountOpt.get().getPlan() != null) {
            Account primaryAccount = primaryAccountOpt.get();
            log.info("Found plan '{}' associated with account ID: {} for customer ID: {}",
                    primaryAccount.getPlan().getPlanName(), primaryAccount.getAccountId(), customer.getCustomerId());
            // Map the Plan entity to PlanDto using the PlanMapper
            return planMapper.toPlanDto(primaryAccount.getPlan());
        } else {
            log.info("No account with an active plan found for customer ID: {}", customer.getCustomerId());
            return null; // Return null if no suitable account/plan is found
        }
    }

    /**
     * Fetches details of all accounts associated with the currently authenticated customer.
     *
     * @param currentUser The authenticated customer user.
     * @return A list of AccountDto. Returns an empty list if the customer has no accounts.
     */
    @Override
    @Transactional(readOnly = true)
    public List<AccountDto> getCurrentUserAccounts(User currentUser) {
        Customer customer = getCustomerFromUser(currentUser);
        log.debug("Fetching accounts for customer ID: {}", customer.getCustomerId());

        // Find all accounts for the customer
        List<Account> accounts = accountRepository.findByCustomer_CustomerId(customer.getCustomerId());
        log.info("Found {} accounts for customer ID: {}", accounts.size(), customer.getCustomerId());

        // Map the Account entities to AccountDto objects
        // Assumes accountMapper has a method like toAccountDto for single objects
        return accounts.stream()
                .map(accountMapper::toAccountDto)
                .collect(Collectors.toList());
    }
}