package com.project.credflow.service.inter;

import com.project.credflow.dto.BpoPerformanceDto;
import com.project.credflow.model.User;

public interface BpoPerformanceService {
    BpoPerformanceDto getAgentPerformanceStats(User agent);
}