package com.hostel.repository;

import com.hostel.entity.MessMenu;
import com.hostel.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessMenuRepository extends JpaRepository<MessMenu, Long> {

    List<MessMenu> findByActiveTrue();

    List<MessMenu> findByDayOfWeekAndActiveTrue(String dayOfWeek);

    Optional<MessMenu> findByDayOfWeekAndMealTypeAndActiveTrue(String dayOfWeek, MealType mealType);
}
