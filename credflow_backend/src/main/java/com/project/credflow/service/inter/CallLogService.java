package com.project.credflow.service.inter;

import com.project.credflow.dto.CallLogDto;
import com.project.credflow.model.User;

import java.util.List;
import java.util.UUID;

public interface CallLogService {

    CallLogDto createCallLog(UUID taskId, User agent, CallLogDto callLogDto);

    List<CallLogDto> getLogsForTask(UUID taskId, User agent);

    List<CallLogDto> getLogsForAgent(User agent);
}