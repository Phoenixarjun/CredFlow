package com.project.credflow.service.impl;

import com.project.credflow.dto.AccountDto;
import com.project.credflow.enums.AccountStatus;
import com.project.credflow.enums.AccountType;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.mapper.AccountMapper;
import com.project.credflow.mapper.CustomerMapper;
import com.project.credflow.mapper.InvoiceMapper;
import com.project.credflow.mapper.PaymentMapper;
import com.project.credflow.model.Account;
import com.project.credflow.model.Customer;
import com.project.credflow.model.User;
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.repository.CustomerRepository;
import com.project.credflow.repository.InvoiceRepository;
import com.project.credflow.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private CustomerMapper customerMapper;

    @Mock
    private AccountMapper accountMapper;

    @Mock
    private InvoiceMapper invoiceMapper;

    @Mock
    private PaymentMapper paymentMapper;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private User testUser;
    private Customer testCustomer;
    private Account testAccount1;
    private Account testAccount2;
    private AccountDto testAccountDto1;
    private AccountDto testAccountDto2;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(UUID.randomUUID());
        testUser.setEmail("test@example.com");

        testCustomer = new Customer();
        testCustomer.setCustomerId(UUID.randomUUID());
        testCustomer.setUser(testUser);
        testCustomer.setCompanyName("Test Company");

        testAccount1 = new Account();
        testAccount1.setAccountId(UUID.randomUUID());
        testAccount1.setAccountNumber("ACC001");
        testAccount1.setAccountType(AccountType.MOBILE);
        testAccount1.setStatus(AccountStatus.ACTIVE);
        testAccount1.setCustomer(testCustomer);

        testAccount2 = new Account();
        testAccount2.setAccountId(UUID.randomUUID());
        testAccount2.setAccountNumber("ACC002");
        testAccount2.setAccountType(AccountType.BROADBAND);
        testAccount2.setStatus(AccountStatus.ACTIVE);
        testAccount2.setCustomer(testCustomer);

        testAccountDto1 = new AccountDto();
        testAccountDto1.setAccountId(testAccount1.getAccountId());
        testAccountDto1.setAccountNumber("ACC001");
        testAccountDto1.setAccountType(AccountType.MOBILE);
        testAccountDto1.setStatus(AccountStatus.ACTIVE);

        testAccountDto2 = new AccountDto();
        testAccountDto2.setAccountId(testAccount2.getAccountId());
        testAccountDto2.setAccountNumber("ACC002");
        testAccountDto2.setAccountType(AccountType.BROADBAND);
        testAccountDto2.setStatus(AccountStatus.ACTIVE);
    }

    @Test
    void getCustomerAccounts_ValidUserReturnsAccounts_Success() {
        // Given
        List<Account> accounts = Arrays.asList(testAccount1, testAccount2);
        when(customerRepository.findByUser_UserId(testUser.getUserId())).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByCustomer_CustomerId(testCustomer.getCustomerId())).thenReturn(accounts);
        when(accountMapper.toAccountDto(testAccount1)).thenReturn(testAccountDto1);
        when(accountMapper.toAccountDto(testAccount2)).thenReturn(testAccountDto2);

        // When
        List<AccountDto> result = customerService.getCustomerAccounts(testUser);

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(testAccountDto1.getAccountId(), result.get(0).getAccountId());
        assertEquals(testAccountDto2.getAccountId(), result.get(1).getAccountId());

        verify(customerRepository).findByUser_UserId(testUser.getUserId());
        verify(accountRepository).findByCustomer_CustomerId(testCustomer.getCustomerId());
        verify(accountMapper, times(2)).toAccountDto(any(Account.class));
    }

    @Test
    void getCustomerAccounts_ValidUserNoAccounts_ReturnsEmptyList() {
        // Given
        List<Account> emptyAccounts = Collections.emptyList();
        when(customerRepository.findByUser_UserId(testUser.getUserId())).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByCustomer_CustomerId(testCustomer.getCustomerId())).thenReturn(emptyAccounts);

        // When
        List<AccountDto> result = customerService.getCustomerAccounts(testUser);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(customerRepository).findByUser_UserId(testUser.getUserId());
        verify(accountRepository).findByCustomer_CustomerId(testCustomer.getCustomerId());
        verify(accountMapper, never()).toAccountDto(any(Account.class));
    }

    @Test
    void getCustomerAccounts_CustomerNotFound_ThrowsResourceNotFoundException() {
        // Given
        when(customerRepository.findByUser_UserId(testUser.getUserId())).thenReturn(Optional.empty());

        // When & Then
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            customerService.getCustomerAccounts(testUser);
        });

        assertEquals("Customer profile not found for the logged-in user.", exception.getMessage());
        verify(customerRepository).findByUser_UserId(testUser.getUserId());
        verify(accountRepository, never()).findByCustomer_CustomerId(any());
        verify(accountMapper, never()).toAccountDto(any(Account.class));
    }

    @Test
    void getCustomerAccounts_NullUser_ThrowsNullPointerException() {
        // When & Then
        assertThrows(NullPointerException.class, () -> {
            customerService.getCustomerAccounts(null);
        });

        verify(customerRepository, never()).findByUser_UserId(any());
        verify(accountRepository, never()).findByCustomer_CustomerId(any());
        verify(accountMapper, never()).toAccountDto(any(Account.class));
    }

    @Test
    void getCustomerAccounts_RepositoryReturnsNull_HandlesNullGracefully() {
        // Given
        when(customerRepository.findByUser_UserId(testUser.getUserId())).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByCustomer_CustomerId(testCustomer.getCustomerId())).thenReturn(null);

        // When & Then
        assertThrows(NullPointerException.class, () -> {
            customerService.getCustomerAccounts(testUser);
        });

        verify(customerRepository).findByUser_UserId(testUser.getUserId());
        verify(accountRepository).findByCustomer_CustomerId(testCustomer.getCustomerId());
    }

    @Test
    void getCustomerAccounts_MapperReturnsNull_HandlesNullDto() {
        // Given
        List<Account> accounts = Arrays.asList(testAccount1);
        when(customerRepository.findByUser_UserId(testUser.getUserId())).thenReturn(Optional.of(testCustomer));
        when(accountRepository.findByCustomer_CustomerId(testCustomer.getCustomerId())).thenReturn(accounts);
        when(accountMapper.toAccountDto(testAccount1)).thenReturn(null);

        // When
        List<AccountDto> result = customerService.getCustomerAccounts(testUser);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertNull(result.get(0));

        verify(customerRepository).findByUser_UserId(testUser.getUserId());
        verify(accountRepository).findByCustomer_CustomerId(testCustomer.getCustomerId());
        verify(accountMapper).toAccountDto(testAccount1);
    }
}