package com.hostel.entity;

import com.hostel.enums.MealType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A 1–5 star rating given by a student for a specific meal.
 */
@Entity
@Table(name = "meal_ratings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MealRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    private MessMenu menu;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private MealType mealType;

    /** Rating value: 1 (poor) to 5 (excellent). */
    @Column(nullable = false)
    private int rating;

    /** Optional feedback text. */
    @Column(length = 500)
    private String comment;

    @Column(nullable = false)
    private LocalDate date;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
