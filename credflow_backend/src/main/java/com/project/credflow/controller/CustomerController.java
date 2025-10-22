package com.project.credflow.controller;

import com.project.credflow.dto.AccountDto;
import com.project.credflow.dto.CustomerDto;
import com.project.credflow.dto.InvoiceDto;
import com.project.credflow.dto.PaymentDto;
import com.project.credflow.dto.PlanSelectionRequest;
import com.project.credflow.model.User;
import com.project.credflow.service.inter.CustomerService;
import com.project.credflow.service.inter.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    private final CustomerService customerService;
    private final PlanService planService;

    @GetMapping("/profile")
    public ResponseEntity<CustomerDto> getCustomerProfile(@AuthenticationPrincipal User user) {
        CustomerDto customerDto = customerService.getCustomerProfile(user);
        return ResponseEntity.ok(customerDto);
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDto>> getCustomerAccounts(@AuthenticationPrincipal User user) {
        List<AccountDto> accounts = customerService.getCustomerAccounts(user);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/invoices")
    public ResponseEntity<List<InvoiceDto>> getAllMyInvoices(@AuthenticationPrincipal User user) {
        List<InvoiceDto> invoices = customerService.getAllCustomerInvoices(user);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/accounts/{accountId}/invoices")
    public ResponseEntity<List<InvoiceDto>> getInvoicesForAccount(
            @AuthenticationPrincipal User user,
            @PathVariable UUID accountId) {

        List<InvoiceDto> invoices = customerService.getInvoicesForAccount(user, accountId);
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/invoices/{invoiceId}/payments")
    public ResponseEntity<List<PaymentDto>> getPaymentsForInvoice(
            @AuthenticationPrincipal User user,
            @PathVariable UUID invoiceId) {

        List<PaymentDto> payments = customerService.getPaymentsForInvoice(user, invoiceId);
        return ResponseEntity.ok(payments);
    }

    @PostMapping("/accounts/{accountId}/select-plan")
    public ResponseEntity<Void> selectPlanForAccount(
            @AuthenticationPrincipal User customer,
            @PathVariable UUID accountId,
            @RequestBody PlanSelectionRequest request) {

        planService.selectPlan(customer, accountId, request.getPlanId());
        return ResponseEntity.ok().build();
    }

}