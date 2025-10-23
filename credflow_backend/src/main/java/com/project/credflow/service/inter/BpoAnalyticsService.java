package com.project.credflow.service.inter;

import com.project.credflow.model.User;

import java.util.List;
import java.util.Map;

public interface BpoAnalyticsService {


    List<Map<String, Object>> getTaskResolutionTrend(User agent);


    List<Map<String, Object>> getCallOutcomeBreakdown(User agent);
}