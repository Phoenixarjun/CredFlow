package com.project.credflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dunning_engine_runs")
@Getter
@Setter
@NoArgsConstructor
public class DunningEngineRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "run_id", columnDefinition = "binary(16)")
    private UUID runId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time") // Nullable until the process finishes
    private LocalDateTime endTime;

    // You could add fields like 'status' (STARTED, COMPLETED, FAILED) or 'actions_executed' later
}