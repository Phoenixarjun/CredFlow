package com.project.credflow.mapper;

import com.project.credflow.dto.BpoTaskDto;
import com.project.credflow.model.BpoTask;
import com.project.credflow.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface BpoTaskMapper {

    BpoTaskMapper INSTANCE = Mappers.getMapper(BpoTaskMapper.class);

    @Mapping(source = "taskId", target = "taskId", qualifiedByName = "uuidToString")
    @Mapping(source = "customer.customerId", target = "customerId", qualifiedByName = "uuidToString")
    @Mapping(source = "customer.user.fullName", target = "customerName")
    @Mapping(source = "invoice.invoiceId", target = "invoiceId", qualifiedByName = "uuidToString")
    @Mapping(source = "invoice.invoiceNumber", target = "invoiceNumber")
    @Mapping(source = "assignedTo.userId", target = "assignedToId", qualifiedByName = "uuidToString")
    @Mapping(source = "assignedTo.fullName", target = "assignedToName")
    BpoTaskDto toDto(BpoTask bpoTask);

    List<BpoTaskDto> toDtoList(List<BpoTask> bpoTasks);

    @Named("uuidToString")
    default String uuidToString(UUID id) {
        return (id != null) ? id.toString() : null;
    }
}