package com.hostel.service;

import com.hostel.dto.mess.*;
import com.hostel.entity.*;
import com.hostel.enums.MealType;
import com.hostel.exception.ResourceNotFoundException;
import com.hostel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessService {

    private final MessMenuRepository menuRepository;
    private final MealRatingRepository ratingRepository;
    private final FoodComplaintRepository foodComplaintRepository;

    /* ── Menu Operations ── */

    /** Get full weekly menu. */
    public List<MenuDTO> getWeeklyMenu() {
        return menuRepository.findByActiveTrue().stream()
                .map(this::mapMenuToDTO)
                .collect(Collectors.toList());
    }

    /** Get menu for a specific day. */
    public List<MenuDTO> getMenuByDay(String dayOfWeek) {
        return menuRepository.findByDayOfWeekAndActiveTrue(dayOfWeek.toUpperCase()).stream()
                .map(this::mapMenuToDTO)
                .collect(Collectors.toList());
    }

    /** Admin creates/updates a menu item. */
    public MenuDTO saveMenuItem(MenuDTO dto) {
        MealType mealType = MealType.valueOf(dto.getMealType().toUpperCase());

        // Check if this slot already exists
        MessMenu menu = menuRepository.findByDayOfWeekAndMealTypeAndActiveTrue(
                        dto.getDayOfWeek().toUpperCase(), mealType)
                .orElse(MessMenu.builder()
                        .dayOfWeek(dto.getDayOfWeek().toUpperCase())
                        .mealType(mealType)
                        .build());

        menu.setItems(dto.getItems());
        menu.setActive(true);
        menu = menuRepository.save(menu);
        return mapMenuToDTO(menu);
    }

    /** Admin deletes a menu item. */
    public void deleteMenuItem(Long id) {
        menuRepository.deleteById(id);
    }

    /* ── Rating Operations ── */

    /** Student rates a meal. */
    public Map<String, Object> rateMeal(MealRatingRequest request, User student) {
        MealType mealType = MealType.valueOf(request.getMealType().toUpperCase());
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();

        // Prevent duplicate ratings
        if (ratingRepository.existsByStudentAndDateAndMealType(student, date, mealType)) {
            throw new IllegalArgumentException("You have already rated " + mealType + " for " + date);
        }

        MealRating rating = MealRating.builder()
                .student(student)
                .mealType(mealType)
                .rating(request.getRating())
                .comment(request.getComment())
                .date(date)
                .build();

        // Try to link to menu entry
        String dayOfWeek = date.getDayOfWeek().name();
        menuRepository.findByDayOfWeekAndMealTypeAndActiveTrue(dayOfWeek, mealType)
                .ifPresent(rating::setMenu);

        ratingRepository.save(rating);

        return Map.of("message", "Rating submitted successfully", "rating", request.getRating());
    }

    /** Get average rating per meal type. */
    public List<Map<String, Object>> getRatingSummary() {
        return ratingRepository.findAverageRatingByMealType().stream()
                .map(row -> Map.<String, Object>of(
                        "mealType", ((MealType) row[0]).name(),
                        "averageRating", Math.round((Double) row[1] * 10.0) / 10.0
                ))
                .collect(Collectors.toList());
    }

    /** Get daily average ratings for trend charts (last 30 days). */
    public List<Map<String, Object>> getDailyRatingTrend() {
        LocalDate from = LocalDate.now().minusDays(30);
        return ratingRepository.findDailyAverageRatings(from).stream()
                .map(row -> Map.<String, Object>of(
                        "date", row[0].toString(),
                        "averageRating", Math.round((Double) row[1] * 10.0) / 10.0
                ))
                .collect(Collectors.toList());
    }

    /** Student's own ratings. */
    public List<Map<String, Object>> getMyRatings(User student) {
        return ratingRepository.findByStudentOrderByCreatedAtDesc(student).stream()
                .map(r -> Map.<String, Object>of(
                        "id", r.getId(),
                        "mealType", r.getMealType().name(),
                        "rating", r.getRating(),
                        "comment", r.getComment() != null ? r.getComment() : "",
                        "date", r.getDate().toString()
                ))
                .collect(Collectors.toList());
    }

    /* ── Food Complaints ── */

    /** Student submits a food complaint. */
    public Map<String, Object> submitFoodComplaint(FoodComplaintRequest request, User student) {
        MealType mealType = MealType.valueOf(request.getMealType().toUpperCase());

        FoodComplaint complaint = FoodComplaint.builder()
                .student(student)
                .mealType(mealType)
                .description(request.getDescription())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .build();

        foodComplaintRepository.save(complaint);
        return Map.of("message", "Food complaint submitted successfully");
    }

    /** Admin views all food complaints. */
    public List<Map<String, Object>> getAllFoodComplaints() {
        return foodComplaintRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(fc -> Map.<String, Object>of(
                        "id", fc.getId(),
                        "studentName", fc.getStudent().getName(),
                        "mealType", fc.getMealType().name(),
                        "description", fc.getDescription(),
                        "date", fc.getDate().toString()
                ))
                .collect(Collectors.toList());
    }

    /* ── Mapping ── */

    private MenuDTO mapMenuToDTO(MessMenu m) {
        return MenuDTO.builder()
                .id(m.getId())
                .dayOfWeek(m.getDayOfWeek())
                .mealType(m.getMealType().name())
                .items(m.getItems())
                .active(m.isActive())
                .build();
    }
}
