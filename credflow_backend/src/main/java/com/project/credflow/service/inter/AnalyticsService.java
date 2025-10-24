package com.project.credflow.service.inter;

import com.project.credflow.dto.DunningActionLogDto;
import com.project.credflow.dto.NotificationLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getOverdueAgingReport();
    List<Map<String, Object>> getDunningActionBreakdown(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getCollectionPerformance(LocalDate startDate, LocalDate endDate);
    List<Map<String, Object>> getBpoTaskStatusBreakdown();

    Page<DunningActionLogDto> getPageOfDunningActionLogs(Pageable pageable);

    Page<NotificationLogDto> getPageOfNotificationLogs(Pageable pageable);
}