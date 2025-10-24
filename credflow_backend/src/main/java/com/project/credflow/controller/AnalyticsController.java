package com.project.credflow.controller;

import com.project.credflow.dto.DunningActionLogDto;
import com.project.credflow.dto.NotificationLogDto;
import com.project.credflow.service.inter.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overdue-aging")
    public ResponseEntity<Map<String, Object>> getOverdueAging() {
        return ResponseEntity.ok(analyticsService.getOverdueAgingReport());
    }

    @GetMapping("/dunning-actions")
    public ResponseEntity<List<Map<String, Object>>> getDunningActions(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(analyticsService.getDunningActionBreakdown(startDate, endDate));
    }

    @GetMapping("/collection-performance")
    public ResponseEntity<Map<String, Object>> getCollectionPerformance(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(analyticsService.getCollectionPerformance(startDate, endDate));
    }

    @GetMapping("/bpo-status")
    public ResponseEntity<List<Map<String, Object>>> getBpoTaskStatus() {
        return ResponseEntity.ok(analyticsService.getBpoTaskStatusBreakdown());
    }

    @GetMapping("/logs/dunning-actions")
    public ResponseEntity<Page<DunningActionLogDto>> getDunningActionLogs(
            @PageableDefault(size = 15, sort = "createdAt") Pageable pageable) {
        Page<DunningActionLogDto> logPage = analyticsService.getPageOfDunningActionLogs(pageable);
        return ResponseEntity.ok(logPage);
    }


    @GetMapping("/logs/notifications")
    public ResponseEntity<Page<NotificationLogDto>> getNotificationLogs(
            @PageableDefault(size = 15, sort = "sentAt") Pageable pageable) {
        Page<NotificationLogDto> logPage = analyticsService.getPageOfNotificationLogs(pageable);
        return ResponseEntity.ok(logPage);
    }
}