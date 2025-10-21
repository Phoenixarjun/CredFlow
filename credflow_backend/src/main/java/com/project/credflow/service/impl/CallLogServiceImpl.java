package com.project.credflow.service.impl;

import com.project.credflow.dto.CallLogDto;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.mapper.CallLogMapper;
import com.project.credflow.model.BpoTask;
import com.project.credflow.model.CallLog;
import com.project.credflow.model.User;
import com.project.credflow.repository.BpoTaskRepository;
import com.project.credflow.repository.CallLogRepository;
import com.project.credflow.service.inter.CallLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CallLogServiceImpl implements CallLogService {

    private final CallLogRepository callLogRepository;
    private final BpoTaskRepository bpoTaskRepository;
    private final CallLogMapper callLogMapper;

    @Override
    @Transactional
    public CallLogDto createCallLog(UUID taskId, User agent, CallLogDto callLogDto) {
        BpoTask task = bpoTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (task.getAssignedTo() == null || !task.getAssignedTo().getUserId().equals(agent.getUserId())) {
            throw new AccessDeniedException("You are not assigned to this task.");
        }

        CallLog newLog = new CallLog();
        newLog.setTask(task);
        newLog.setAgent(agent);
        newLog.setCallOutcome(callLogDto.getCallOutcome());
        newLog.setNotes(callLogDto.getNotes());

        CallLog savedLog = callLogRepository.save(newLog);
        return callLogMapper.toDto(savedLog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CallLogDto> getLogsForTask(UUID taskId, User agent) {
        BpoTask task = bpoTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (task.getAssignedTo() == null || !task.getAssignedTo().getUserId().equals(agent.getUserId())) {
            throw new AccessDeniedException("You are not assigned to this task.");
        }

        List<CallLog> logs = callLogRepository.findByTask_TaskIdOrderByCreatedAtDesc(taskId);
        return callLogMapper.toDtoList(logs);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CallLogDto> getLogsForAgent(User agent) {
        List<CallLog> logs = callLogRepository.findByAgent_UserIdOrderByCreatedAtDesc(agent.getUserId());
        return callLogMapper.toDtoList(logs);
    }
}