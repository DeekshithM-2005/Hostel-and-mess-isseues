package com.hostel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * In-app notification delivered to a user (e.g. complaint status change,
 * warden response, admin announcement).
 */
@Entity
@Table(name = "notifications")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String message;

    /** Notification category: COMPLAINT_UPDATE, NEW_COMMENT, ESCALATION, SYSTEM, etc. */
    @Column(nullable = false, length = 30)
    private String type;

    @Builder.Default
    @Column(name = "is_read")
    private boolean read = false;

    /** Optional reference to a related entity (e.g. complaint id). */
    private Long referenceId;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
