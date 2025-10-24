package com.project.credflow.mapper;

import com.project.credflow.dto.NotificationLogDto;
import com.project.credflow.model.NotificationLog;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationLogMapper {

    NotificationLogMapper INSTANCE = Mappers.getMapper(NotificationLogMapper.class);

    NotificationLogDto toNotificationLogDto(NotificationLog notificationLog);

    List<NotificationLogDto> toNotificationLogDtoList(List<NotificationLog> notificationLogs);
}