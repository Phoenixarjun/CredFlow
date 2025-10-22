package com.project.credflow.service.inter;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getOverdueAgingReport(); // Widget 1
    List<Map<String, Object>> getDunningActionBreakdown(LocalDate startDate, LocalDate endDate); // Widget 2
    Map<String, Object> getCollectionPerformance(LocalDate startDate, LocalDate endDate); // Widget 3
    List<Map<String, Object>> getBpoTaskStatusBreakdown(); // Widget 4
}