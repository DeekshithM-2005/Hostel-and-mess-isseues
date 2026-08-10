package com.hostel.controller;

import com.hostel.dto.complaint.*;
import com.hostel.entity.User;
import com.hostel.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Complaint controller — CRUD, status transitions, comments, escalation.
 *
 * POST   /api/complaints                  → create (STUDENT)
 * GET    /api/complaints                  → list (role-scoped)
 * GET    /api/complaints/{id}             → detail
 * PATCH  /api/complaints/{id}/status      → update status (WARDEN/ADMIN)
 * POST   /api/complaints/{id}/comments    → add comment (STUDENT/WARDEN)
 * POST   /api/complaints/{id}/escalate    → escalate (WARDEN/ADMIN)
 */
@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> create(
            @Valid @RequestBody ComplaintRequest request,
            @AuthenticationPrincipal User student) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(complaintService.createComplaint(request, student));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(complaintService.getComplaints(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaint(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(complaintService.updateStatus(id, request, user));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        String text = body.get("text");
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Comment text is required");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(complaintService.addComment(id, text, user));
    }

    @PostMapping("/{id}/escalate")
    public ResponseEntity<ComplaintResponse> escalate(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(complaintService.escalate(id, user));
    }
}
