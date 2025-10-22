package com.project.credflow.mapper;

import com.project.credflow.dto.PlanDto;
import com.project.credflow.model.Plan;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface PlanMapper {
    PlanMapper INSTANCE = Mappers.getMapper(PlanMapper.class);

    PlanDto toPlanDto(Plan plan);

    Plan toPlan(PlanDto planDto);
}