package com.project.credflow.service.impl;

import com.project.credflow.dto.BpoPerformanceDto;
import com.project.credflow.enums.BpoTaskStatus;
import com.project.credflow.model.User;
import com.project.credflow.repository.BpoTaskRepository;
import com.project.credflow.repository.CallLogRepository;
import com.project.credflow.service.inter.BpoPerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BpoPerformanceServiceImpl implements BpoPerformanceService {

    private final BpoTaskRepository bpoTaskRepository;
    private final CallLogRepository callLogRepository;

    @Override
    @Transactional(readOnly = true)
    public BpoPerformanceDto getAgentPerformanceStats(User agent) {

        List<BpoTaskStatus> resolvedStatuses = List.of(
                BpoTaskStatus.RESOLVED_PAYMENT_MADE,
                BpoTaskStatus.RESOLVED_DISPUTED,
                BpoTaskStatus.RESOLVED_NO_CONTACT,
                BpoTaskStatus.COMPLETED,
                BpoTaskStatus.CLOSED
        );

        long totalResolved = bpoTaskRepository.countByAssignedToAndStatusIn(agent, resolvedStatuses);

        long totalCalls = callLogRepository.countByAgent(agent);

        return new BpoPerformanceDto(totalResolved, totalCalls);
    }
}