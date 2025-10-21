package com.project.credflow.service.impl;

import com.project.credflow.dto.BpoTaskDto;
import com.project.credflow.enums.BpoTaskStatus;
import com.project.credflow.exception.ResourceNotFoundException;
import com.project.credflow.mapper.BpoTaskMapper;
import com.project.credflow.model.BpoTask;
import com.project.credflow.model.User;
import com.project.credflow.repository.BpoTaskRepository;
import com.project.credflow.service.inter.BpoTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BpoTaskServiceImpl implements BpoTaskService {

    private final BpoTaskRepository bpoTaskRepository;
    private final BpoTaskMapper bpoTaskMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BpoTaskDto> getTaskQueueForAgent(User agent) {
        List<BpoTask> tasks = bpoTaskRepository.findTaskQueueForAgent(agent);


        return bpoTaskMapper.toDtoList(tasks);
    }

    @Override
    @Transactional
    public BpoTaskDto claimTask(UUID taskId, User agent) {
        BpoTask task = bpoTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (task.getStatus() != BpoTaskStatus.NEW) {
            throw new AccessDeniedException("Task has already been claimed.");
        }

        task.setAssignedTo(agent);
        task.setStatus(BpoTaskStatus.IN_PROGRESS);
        BpoTask savedTask = bpoTaskRepository.save(task);

        return bpoTaskMapper.toDto(savedTask);
    }

    @Override
    @Transactional
    public BpoTaskDto updateTask(UUID taskId, BpoTaskDto updateRequest, User agent) {
        BpoTask task = bpoTaskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        // Security check: Only the assigned agent can update the task
        if (task.getAssignedTo() == null || !task.getAssignedTo().getUserId().equals(agent.getUserId())) {
            throw new AccessDeniedException("You are not assigned to this task.");
        }

        // Update fields from DTO
        task.setStatus(updateRequest.getStatus()); // e.g., COMPLETED, CLOSED
        task.setResolutionNotes(updateRequest.getResolutionNotes());

        BpoTask savedTask = bpoTaskRepository.save(task);
        return bpoTaskMapper.toDto(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BpoTaskDto> getAllTasks() {
        List<BpoTask> tasks = bpoTaskRepository.findAll();
        return bpoTaskMapper.toDtoList(tasks);
    }
}