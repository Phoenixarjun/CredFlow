package com.project.credflow.controller;

import com.project.credflow.dto.PlanDto;
import com.project.credflow.service.inter.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    @GetMapping
    public ResponseEntity<List<PlanDto>> getActivePlans() {
        List<PlanDto> plans = planService.getAllActivePlans();
        return ResponseEntity.ok(plans);
    }
}