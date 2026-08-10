package com.hostel.entity;

import com.hostel.enums.MealType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Daily mess menu entry — one row per meal type per day.
 */
@Entity
@Table(name = "mess_menu",
       uniqueConstraints = @UniqueConstraint(columnNames = {"day_of_week", "meal_type"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class MessMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Day of the week: MONDAY, TUESDAY, … SUNDAY. */
    @Column(name = "day_of_week", nullable = false, length = 10)
    private String dayOfWeek;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", nullable = false, length = 10)
    private MealType mealType;

    /** Comma-separated list of items served. */
    @Column(nullable = false, length = 500)
    private String items;

    /** Optional: override menu for a specific date. */
    private LocalDate specificDate;

    @Builder.Default
    private boolean active = true;
}
