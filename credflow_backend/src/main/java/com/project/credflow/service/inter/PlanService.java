package com.project.credflow.service.inter;

import com.project.credflow.dto.PlanDto;
import com.project.credflow.model.User;

import java.util.List;
import java.util.UUID;

public interface PlanService {
    List<PlanDto> getAllActivePlans();

    void selectPlan(User customer, UUID accountId, UUID planId);

    List<PlanDto> getAllPlans();

    PlanDto createPlan(PlanDto planDto);

    PlanDto updatePlan(UUID planId, PlanDto planDto);
}