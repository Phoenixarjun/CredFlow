package com.project.credflow.service.impl;

import com.project.credflow.model.User;
import com.project.credflow.repository.BpoTaskRepository;
import com.project.credflow.repository.CallLogRepository;
import com.project.credflow.service.inter.BpoAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class BpoAnalyticsServiceImpl implements BpoAnalyticsService {

    private final BpoTaskRepository bpoTaskRepository;
    private final CallLogRepository callLogRepository;

    @Override
    public List<Map<String, Object>> getTaskResolutionTrend(User agent) {
        log.info("Fetching task resolution trend for agent: {}", agent.getUserId());
        LocalDateTime startDate = LocalDateTime.now().minusDays(7).toLocalDate().atStartOfDay();

        return bpoTaskRepository.getTaskResolutionTrend(agent.getUserId(), startDate);
    }

    @Override
    public List<Map<String, Object>> getCallOutcomeBreakdown(User agent) {
        log.info("Fetching call outcome breakdown for agent: {}", agent.getUserId());
        LocalDateTime startDate = LocalDateTime.now().minusDays(30).toLocalDate().atStartOfDay();

        return callLogRepository.getCallOutcomeBreakdown(agent, startDate);
    }
}