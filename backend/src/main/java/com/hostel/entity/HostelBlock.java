package com.hostel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Represents a physical hostel block/building on campus.
 * Each block may have a warden assigned to it.
 */
@Entity
@Table(name = "hostel_blocks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class HostelBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private int totalFloors;

    /** The warden currently assigned to this block (nullable). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warden_id")
    private User warden;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
