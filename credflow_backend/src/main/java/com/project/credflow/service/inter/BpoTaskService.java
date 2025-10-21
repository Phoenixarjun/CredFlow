package com.project.credflow.service.inter;

import com.project.credflow.dto.BpoTaskDto;
import com.project.credflow.model.User;
import java.util.List;
import java.util.UUID;

public interface BpoTaskService {
    List<BpoTaskDto> getTaskQueueForAgent(User agent);
    BpoTaskDto claimTask(UUID taskId, User agent);
    BpoTaskDto updateTask(UUID taskId, BpoTaskDto updateRequest, User agent);
    List<BpoTaskDto> getAllTasks();
}