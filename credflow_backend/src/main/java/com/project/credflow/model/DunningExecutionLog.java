package com.project.credflow.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dunning_execution_logs")
@Getter
@Setter
@NoArgsConstructor
public class DunningExecutionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "log_id", updatable = false, nullable = false, columnDefinition = "binary(16)")
    private UUID logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id", nullable = false)
    private DunningRule dunningRule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @Column(name = "executed_at", nullable = false, updatable = false)
    private LocalDateTime executedAt;

    public DunningExecutionLog(DunningRule dunningRule, Invoice invoice) {
        this.dunningRule = dunningRule;
        this.invoice = invoice;
        this.executedAt = LocalDateTime.now();
    }
}