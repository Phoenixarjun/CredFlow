package com.project.credflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BpoPerformanceDto {

    private long totalTasksResolved;
    private long totalCallsLogged;
    // We can add more stats here later, like "Total Collections"


}