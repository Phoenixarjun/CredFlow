package com.project.credflow.service.impl;

import com.project.credflow.repository.*;
import com.project.credflow.service.inter.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    private final InvoiceRepository invoiceRepository;
    private final DunningActionLogRepository dunningActionLogRepository; // Use our new repo
    private final BpoTaskRepository bpoTaskRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public Map<String, Object> getOverdueAgingReport() {
        return invoiceRepository.getOverdueAgingBuckets();
    }

    @Override
    public List<Map<String, Object>> getDunningActionBreakdown(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        return dunningActionLogRepository.getActionBreakdown(startDateTime, endDateTime);
    }

    @Override
    public Map<String, Object> getCollectionPerformance(LocalDate startDate, LocalDate endDate) {
        BigDecimal totalCollected = paymentRepository.sumSuccessfulPaymentsBetweenDates(startDate, endDate);
        BigDecimal totalBilled = invoiceRepository.sumInvoicesCreatedBetweenDates(startDate, endDate);
        Map<String, Object> performance = new HashMap<>();
        performance.put("totalCollected", totalCollected);
        performance.put("totalBilled", totalBilled);
        return performance;
    }

    @Override
    public List<Map<String, Object>> getBpoTaskStatusBreakdown() {
        return bpoTaskRepository.getStatusBreakdown();
    }
}