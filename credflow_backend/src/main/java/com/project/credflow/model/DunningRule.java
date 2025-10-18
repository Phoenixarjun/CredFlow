// in: com.project.credflow.model.DunningRule.java
package com.project.credflow.model;

import com.project.credflow.enums.ActionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dunning_rules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DunningRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "rule_id")
    private UUID ruleId;

    @Column(name = "days_overdue", nullable = false)
    private Integer daysOverdue;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType;

    // This is the crucial link to the template
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", referencedColumnName = "template_id")
    private NotificationTemplate template; // Nullable if action_type is e.g. CREATE_BPO_TASK

    @Column(name = "is_active")
    private Boolean isActive;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}