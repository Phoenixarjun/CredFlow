package com.project.credflow.model;

import com.project.credflow.enums.BpoTaskPriority;
import com.project.credflow.enums.BpoTaskStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bpo_tasks")
@Getter
@Setter
@NoArgsConstructor
public class BpoTask {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "task_id", updatable = false, nullable = false, columnDefinition = "binary(16)")
    private UUID taskId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id") // Can be nullable if task is general
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to") // Null until an agent claims it
    private User assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BpoTaskStatus status = BpoTaskStatus.NEW;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false)
    private BpoTaskPriority priority = BpoTaskPriority.MEDIUM;

    @Column(name = "task_description", length = 1000)
    private String taskDescription;

    @Column(name = "resolution_notes", length = 2000)
    private String resolutionNotes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}