package com.hostel.controller;

import com.hostel.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Analytics controller — admin-only dashboard data.
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/complaints/by-status")
    public ResponseEntity<Map<String, Long>> getComplaintsByStatus() {
        return ResponseEntity.ok(analyticsService.getComplaintsByStatus());
    }

    @GetMapping("/complaints/by-category")
    public ResponseEntity<Map<String, Long>> getComplaintsByCategory() {
        return ResponseEntity.ok(analyticsService.getComplaintsByCategory());
    }

    @GetMapping("/mess/trend")
    public ResponseEntity<List<Map<String, Object>>> getMessTrend() {
        return ResponseEntity.ok(analyticsService.getMessTrend());
    }
}
