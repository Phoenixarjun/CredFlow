package com.project.credflow.model;

import com.project.credflow.enums.NotificationChannel;
import com.project.credflow.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_logs")
@Getter
@Setter
@NoArgsConstructor
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "binary(16)")
    private UUID logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationChannel channel;

    @Column(name = "template_name")
    private String templateName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    @Column(name = "failure_reason", length = 1000)
    private String failureReason;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    public NotificationLog(Customer customer, NotificationChannel channel, String templateName, NotificationStatus status, String failureReason) {
        this.customer = customer;
        this.channel = channel;
        this.templateName = templateName;
        this.status = status;
        this.failureReason = failureReason;
        this.sentAt = LocalDateTime.now();
    }
}