package com.project.credflow.mapper;

import com.project.credflow.dto.CallLogDto;
import com.project.credflow.model.CallLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface CallLogMapper {

    CallLogMapper INSTANCE = Mappers.getMapper(CallLogMapper.class);

    @Mapping(source = "logId", target = "logId", qualifiedByName = "uuidToString")
    @Mapping(source = "task.taskId", target = "taskId", qualifiedByName = "uuidToString")
    @Mapping(source = "agent.userId", target = "agentId", qualifiedByName = "uuidToString")
    @Mapping(source = "agent.fullName", target = "agentName")
    CallLogDto toDto(CallLog callLog);

    List<CallLogDto> toDtoList(List<CallLog> callLogs);

    @Named("uuidToString")
    default String uuidToString(UUID id) {
        return (id != null) ? id.toString() : null;
    }
}