package com.project.credflow.model;

import com.project.credflow.enums.RuleActionType; // 1. Use your correct enum
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dunning_action_logs")
@Getter
@Setter
@NoArgsConstructor
public class DunningActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "binary(16)")
    private UUID logId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private RuleActionType actionType; // 2. Use your enum here

    @Column(name = "invoice_id", nullable = false, columnDefinition = "binary(16)")
    private UUID invoiceId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public DunningActionLog(RuleActionType actionType, UUID invoiceId) {
        this.actionType = actionType;
        this.invoiceId = invoiceId;
        this.createdAt = LocalDateTime.now();
    }
}