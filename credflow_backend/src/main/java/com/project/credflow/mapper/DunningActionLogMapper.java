package com.project.credflow.mapper;

import com.project.credflow.dto.DunningActionLogDto;
import com.project.credflow.model.DunningActionLog;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DunningActionLogMapper {

    DunningActionLogMapper INSTANCE = Mappers.getMapper(DunningActionLogMapper.class);

    DunningActionLogDto toDunningActionLogDto(DunningActionLog dunningActionLog);

    List<DunningActionLogDto> toDunningActionLogDtoList(List<DunningActionLog> dunningActionLogs);
}