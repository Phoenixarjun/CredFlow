package com.project.credflow.controller;

import com.project.credflow.model.User;
import com.project.credflow.service.inter.BpoAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bpo/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('BPO_AGENT')")
public class BpoAnalyticsController {

    private final BpoAnalyticsService bpoAnalyticsService;


    @GetMapping("/task-trend")
    public ResponseEntity<List<Map<String, Object>>> getTaskResolutionTrend(
            @AuthenticationPrincipal User loggedInAgent) {

        List<Map<String, Object>> trendData = bpoAnalyticsService.getTaskResolutionTrend(loggedInAgent);
        return ResponseEntity.ok(trendData);
    }


    @GetMapping("/outcome-breakdown")
    public ResponseEntity<List<Map<String, Object>>> getCallOutcomeBreakdown(
            @AuthenticationPrincipal User loggedInAgent) {

        List<Map<String, Object>> breakdownData = bpoAnalyticsService.getCallOutcomeBreakdown(loggedInAgent);
        return ResponseEntity.ok(breakdownData);
    }
}