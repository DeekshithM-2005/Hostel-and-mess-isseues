package com.hostel.entity;

import com.hostel.enums.ComplaintStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Audit-trail entry for a complaint status change.
 * Records who changed the status, from what, to what, and when.
 */
@Entity
@Table(name = "complaint_timeline")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ComplaintTimeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    /** Previous status (null for the initial creation event). */
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ComplaintStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ComplaintStatus newStatus;

    /** Optional note explaining the status change. */
    @Column(length = 500)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_id", nullable = false)
    private User changedBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
