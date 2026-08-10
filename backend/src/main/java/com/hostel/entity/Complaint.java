package com.hostel.entity;

import com.hostel.enums.ComplaintCategory;
import com.hostel.enums.ComplaintPriority;
import com.hostel.enums.ComplaintStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * A room-issue complaint raised by a student.
 * Auto-routed to the warden of the student's hostel block.
 */
@Entity
@Table(name = "complaints")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ComplaintCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ComplaintPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ComplaintStatus status = ComplaintStatus.PENDING;

    /** The student who filed this complaint. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    /** The hostel block the complaint is associated with. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_block_id")
    private HostelBlock hostelBlock;

    /** Warden auto-assigned based on hostel block. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_warden_id")
    private User assignedWarden;

    private Integer floorNumber;

    private String roomNumber;

    /** Relative path to uploaded image (nullable). */
    private String imageUrl;

    /** Conversation thread between student and warden. */
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<ComplaintComment> comments = new ArrayList<>();

    /** Status change audit trail. */
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<ComplaintTimeline> timeline = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
