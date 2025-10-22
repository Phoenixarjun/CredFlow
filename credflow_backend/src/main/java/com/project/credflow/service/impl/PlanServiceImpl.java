package com.project.credflow.service.impl;

import com.project.credflow.dto.PlanDto;
import com.project.credflow.exception.AccessNextLevelException;
import com.project.credflow.mapper.PlanMapper;
import com.project.credflow.model.Account;
import com.project.credflow.model.Plan;
import com.project.credflow.model.User;
import com.project.credflow.repository.AccountRepository;
import com.project.credflow.repository.PlanRepository;
import com.project.credflow.service.inter.PlanService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.project.credflow.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;
    private final AccountRepository accountRepository;
    private final PlanMapper planMapper;

    private static final Logger log = LoggerFactory.getLogger(PlanServiceImpl.class);

    @Override
    @Transactional(readOnly = true)
    public List<PlanDto> getAllActivePlans() {
        List<Plan> activePlans = planRepository.findByIsActiveTrue();

        log.info("--- DEBUGGING PLAN FETCH ---");
        if (activePlans.isEmpty()) {
            log.warn("No active plans found in database.");
        } else {
            Plan firstPlan = activePlans.get(0);
            log.info("First plan name: {}", firstPlan.getPlanName());
            log.info("First plan type (from DB): {}", firstPlan.getPlanType()); // <-- THIS IS THE TEST
        }

        return activePlans.stream()
                .map(planMapper::toPlanDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void selectPlan(User customer, UUID accountId, UUID planId) {
        Plan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + planId));

        if (!plan.isActive()) {
            throw new AccessDeniedException("This plan is not active and cannot be selected.");
        }

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));

        if (!account.getCustomer().getUser().getUserId().equals(customer.getUserId())) {
            throw new AccessNextLevelException("You do not have permission to modify this account.");
        }

        account.setPlan(plan);
        account.setCurrentSpeed(plan.getDefaultSpeed());

        accountRepository.save(account);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlanDto> getAllPlans() {
        log.info("Admin fetching all plans (active and inactive)");
        return planRepository.findAll().stream()
                .map(planMapper::toPlanDto)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public PlanDto createPlan(PlanDto planDto) {
        log.info("Admin creating new plan: {}", planDto.getPlanName());
        Plan plan = planMapper.toPlan(planDto);
        plan.setPlanId(null); // Ensure it's a new entity
        Plan savedPlan = planRepository.save(plan);
        return planMapper.toPlanDto(savedPlan);
    }

    @Override
    @Transactional
    public PlanDto updatePlan(UUID planId, PlanDto planDto) {
        log.info("Admin updating plan: {}", planId);
        Plan existingPlan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + planId));

        existingPlan.setPlanName(planDto.getPlanName());
        existingPlan.setType(planDto.getType());
        existingPlan.setPlanType(planDto.getPlanType());
        existingPlan.setDefaultSpeed(planDto.getDefaultSpeed());
        existingPlan.setPrice(planDto.getPrice());
        existingPlan.setActive(planDto.isActive());

        Plan updatedPlan = planRepository.save(existingPlan);
        return planMapper.toPlanDto(updatedPlan);
    }
}