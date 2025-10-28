package com.project.credflow.controller;

import com.project.credflow.dto.AiAdminSummaryDto; // <-- 1. Import new DTO
import com.project.credflow.dto.CustomerDto;
import com.project.credflow.dto.CustomerHistoryDto;
import com.project.credflow.dto.ManualCureRequestDto;
import com.project.credflow.model.User;
import com.project.credflow.service.inter.AdminAiService;
import com.project.credflow.service.inter.CustomerService;
import com.project.credflow.service.inter.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/customers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCustomerController {

    private final CustomerService customerService;
    private final PaymentService paymentService;
    private final AdminAiService adminAiService;

    @GetMapping("/{customerId}/history")
    public ResponseEntity<CustomerHistoryDto> getCustomerHistory(@PathVariable UUID customerId) {
        CustomerHistoryDto history = customerService.getCustomerDetailedHistory(customerId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerDto>> searchCustomers(@RequestParam("query") String query) {
        List<CustomerDto> results = customerService.searchCustomers(query);
        return ResponseEntity.ok(results);
    }

    @PostMapping("/{customerId}/manual-cure")
    public ResponseEntity<Void> manualCure(
            @PathVariable UUID customerId,
            @AuthenticationPrincipal User adminUser,
            @Valid @RequestBody ManualCureRequestDto requestDto) {

        paymentService.manuallyCureCustomer(customerId, adminUser, requestDto.getReason());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{customerId}/ai-summary")
    public ResponseEntity<AiAdminSummaryDto> getAiCustomerSummary(@PathVariable UUID customerId) { // <-- 2. Update return type
        AiAdminSummaryDto summary = adminAiService.generateCustomerSummary(customerId); // <-- 3. Get new DTO
        return ResponseEntity.ok(summary); // <-- 4. Return new DTO
    }
}