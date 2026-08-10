package com.hostel.controller;

import com.hostel.dto.mess.*;
import com.hostel.entity.User;
import com.hostel.service.MessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Mess controller — menu CRUD, meal ratings, food complaints.
 *
 * GET    /api/mess/menu                → weekly menu (all)
 * POST   /api/mess/menu                → create/update menu (ADMIN)
 * DELETE /api/mess/menu/{id}           → delete menu item (ADMIN)
 * POST   /api/mess/ratings             → rate a meal (STUDENT)
 * GET    /api/mess/ratings/summary     → average ratings (all)
 * GET    /api/mess/ratings/trend       → daily trend (all)
 * GET    /api/mess/ratings/mine        → student's own ratings
 * POST   /api/mess/food-complaints     → submit food complaint (STUDENT)
 * GET    /api/mess/food-complaints     → list all food complaints (ADMIN)
 */
@RestController
@RequestMapping("/api/mess")
@RequiredArgsConstructor
public class MessController {

    private final MessService messService;

    @GetMapping("/menu")
    public ResponseEntity<List<MenuDTO>> getMenu() {
        return ResponseEntity.ok(messService.getWeeklyMenu());
    }

    @GetMapping("/menu/{day}")
    public ResponseEntity<List<MenuDTO>> getMenuByDay(@PathVariable String day) {
        return ResponseEntity.ok(messService.getMenuByDay(day));
    }

    @PostMapping("/menu")
    public ResponseEntity<MenuDTO> saveMenu(@RequestBody MenuDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(messService.saveMenuItem(dto));
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        messService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/ratings")
    public ResponseEntity<Map<String, Object>> rateMeal(
            @Valid @RequestBody MealRatingRequest request,
            @AuthenticationPrincipal User student) {
        return ResponseEntity.status(HttpStatus.CREATED).body(messService.rateMeal(request, student));
    }

    @GetMapping("/ratings/summary")
    public ResponseEntity<List<Map<String, Object>>> getRatingSummary() {
        return ResponseEntity.ok(messService.getRatingSummary());
    }

    @GetMapping("/ratings/trend")
    public ResponseEntity<List<Map<String, Object>>> getDailyTrend() {
        return ResponseEntity.ok(messService.getDailyRatingTrend());
    }

    @GetMapping("/ratings/mine")
    public ResponseEntity<List<Map<String, Object>>> getMyRatings(@AuthenticationPrincipal User student) {
        return ResponseEntity.ok(messService.getMyRatings(student));
    }

    @PostMapping("/food-complaints")
    public ResponseEntity<Map<String, Object>> submitFoodComplaint(
            @Valid @RequestBody FoodComplaintRequest request,
            @AuthenticationPrincipal User student) {
        return ResponseEntity.status(HttpStatus.CREATED).body(messService.submitFoodComplaint(request, student));
    }

    @GetMapping("/food-complaints")
    public ResponseEntity<List<Map<String, Object>>> getAllFoodComplaints() {
        return ResponseEntity.ok(messService.getAllFoodComplaints());
    }
}
