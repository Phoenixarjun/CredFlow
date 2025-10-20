package com.project.credflow.model;

import com.project.credflow.enums.Channel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_templates", uniqueConstraints = {
        @UniqueConstraint(columnNames = "template_name") // Ensure template names are unique
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "template_id")
    private UUID templateId;

    @NotBlank(message = "Template name cannot be blank")
    @Size(max = 100, message = "Template name cannot exceed 100 characters")
    @Column(name = "template_name", nullable = false, unique = true, length = 100)
    private String templateName;

    @NotNull(message = "Channel cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(name = "channel", nullable = false)
    private Channel channel;

    @NotBlank(message = "Subject cannot be blank for EMAIL channel")
    @Size(max = 255, message = "Subject cannot exceed 255 characters")
    @Column(name = "subject", nullable = false, length = 255)
    private String subject;

    @NotBlank(message = "Body cannot be blank")
    @Lob
    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "user_id", updatable = false)
    private User createdByUser;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}