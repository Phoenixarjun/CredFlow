package com.project.credflow.service.impl;

import com.project.credflow.dto.DunningActionLogDto;
import com.project.credflow.dto.NotificationLogDto;
import com.project.credflow.mapper.DunningActionLogMapper;
import com.project.credflow.mapper.NotificationLogMapper;
import com.project.credflow.model.DunningActionLog;
import com.project.credflow.model.NotificationLog;
import com.project.credflow.repository.*;
import com.project.credflow.service.inter.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final DunningActionLogRepository dunningActionLogRepository;
    private final BpoTaskRepository bpoTaskRepository;
    private final PaymentRepository paymentRepository;

    private final NotificationLogRepository notificationLogRepository;
    private final DunningActionLogMapper dunningActionLogMapper;
    private final NotificationLogMapper notificationLogMapper;


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



    @Override
    public Page<DunningActionLogDto> getPageOfDunningActionLogs(Pageable pageable) {
        log.info("Fetching paginated dunning action logs: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<DunningActionLog> logPage = dunningActionLogRepository.findAll(pageable);
        return logPage.map(dunningActionLogMapper::toDunningActionLogDto);
    }

    @Override
    public Page<NotificationLogDto> getPageOfNotificationLogs(Pageable pageable) {
        log.info("Fetching paginated notification logs: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        Page<NotificationLog> logPage = notificationLogRepository.findAll(pageable);
        return logPage.map(notificationLogMapper::toNotificationLogDto);
    }
}