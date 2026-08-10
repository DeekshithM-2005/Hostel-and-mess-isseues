package com.hostel.repository;

import com.hostel.entity.MealRating;
import com.hostel.entity.User;
import com.hostel.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealRatingRepository extends JpaRepository<MealRating, Long> {

    List<MealRating> findByStudentOrderByCreatedAtDesc(User student);

    List<MealRating> findByDateAndMealType(LocalDate date, MealType mealType);

    /** Average rating per meal type — for analytics. */
    @Query("SELECT r.mealType, AVG(r.rating) FROM MealRating r GROUP BY r.mealType")
    List<Object[]> findAverageRatingByMealType();

    /** Daily average ratings over a date range — for trend charts. */
    @Query("SELECT r.date, AVG(r.rating) FROM MealRating r WHERE r.date >= :from GROUP BY r.date ORDER BY r.date")
    List<Object[]> findDailyAverageRatings(LocalDate from);

    /** Check if a student already rated a meal on a specific date. */
    boolean existsByStudentAndDateAndMealType(User student, LocalDate date, MealType mealType);
}
