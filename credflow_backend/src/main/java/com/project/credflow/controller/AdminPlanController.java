package com.project.credflow.controller;

import com.project.credflow.dto.PlanDto;
import com.project.credflow.service.inter.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/plans")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPlanController {

    private final PlanService planService;


    @GetMapping
    public ResponseEntity<List<PlanDto>> getAllPlans() {
        List<PlanDto> plans = planService.getAllPlans();
        return ResponseEntity.ok(plans);
    }

    @PostMapping
    public ResponseEntity<PlanDto> createPlan(@RequestBody PlanDto planDto) {
        PlanDto newPlan = planService.createPlan(planDto);
        return new ResponseEntity<>(newPlan, HttpStatus.CREATED);
    }

    @PutMapping("/{planId}")
    public ResponseEntity<PlanDto> updatePlan(@PathVariable UUID planId, @RequestBody PlanDto planDto) {
        PlanDto updatedPlan = planService.updatePlan(planId, planDto);
        return ResponseEntity.ok(updatedPlan);
    }
}