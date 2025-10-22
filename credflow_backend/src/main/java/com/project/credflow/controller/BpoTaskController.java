package com.project.credflow.controller;

import com.project.credflow.dto.BpoPerformanceDto;
import com.project.credflow.dto.BpoTaskDto;
import com.project.credflow.dto.CallLogDto;
import com.project.credflow.model.User;
import com.project.credflow.service.inter.BpoPerformanceService;
import com.project.credflow.service.inter.BpoTaskService;
import com.project.credflow.service.inter.CallLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bpo")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('BPO_AGENT')") // Secure this entire controller for BPO_AGENTs
public class BpoTaskController {

    private final BpoTaskService bpoTaskService;
    private final CallLogService callLogService;
    private final BpoPerformanceService bpoPerformanceService;
    @GetMapping("/tasks/my-queue")
    public ResponseEntity<List<BpoTaskDto>> getMyTaskQueue(@AuthenticationPrincipal User bpoAgent) {
        List<BpoTaskDto> tasks = bpoTaskService.getTaskQueueForAgent(bpoAgent);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/tasks/{taskId}/claim")
    public ResponseEntity<BpoTaskDto> claimTask(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User bpoAgent) {
        BpoTaskDto updatedTask = bpoTaskService.claimTask(taskId, bpoAgent);
        return ResponseEntity.ok(updatedTask);
    }

    @PutMapping("/tasks/{taskId}/update")
    public ResponseEntity<BpoTaskDto> updateTask(
            @PathVariable UUID taskId,
            @RequestBody BpoTaskDto updateRequest, // DTO will carry new status and notes
            @AuthenticationPrincipal User bpoAgent) {
        BpoTaskDto updatedTask = bpoTaskService.updateTask(taskId, updateRequest, bpoAgent);
        return ResponseEntity.ok(updatedTask);
    }

    @PostMapping("/tasks/{taskId}/log-call")
    public ResponseEntity<CallLogDto> logCall(
            @PathVariable UUID taskId,
            @RequestBody CallLogDto callLogRequest, // DTO with outcome and notes
            @AuthenticationPrincipal User bpoAgent) {
        CallLogDto newLog = callLogService.createCallLog(taskId, bpoAgent, callLogRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(newLog);
    }


    @GetMapping("/tasks/{taskId}/logs")
    public ResponseEntity<List<CallLogDto>> getTaskLogs(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User bpoAgent) {
        List<CallLogDto> logs = callLogService.getLogsForTask(taskId, bpoAgent);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/my-call-logs")
    public ResponseEntity<List<CallLogDto>> getMyCallLogs(@AuthenticationPrincipal User bpoAgent) {
        List<CallLogDto> logs = callLogService.getLogsForAgent(bpoAgent);
        return ResponseEntity.ok(logs);
    }
    @GetMapping("/my-performance")
    public ResponseEntity<BpoPerformanceDto> getMyPerformanceStats(@AuthenticationPrincipal User bpoAgent) {
        BpoPerformanceDto stats = bpoPerformanceService.getAgentPerformanceStats(bpoAgent);
        return ResponseEntity.ok(stats);
    }
}