package com.hostel.controller;

import com.hostel.dto.user.UserProfileDTO;
import com.hostel.entity.User;
import com.hostel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * User/profile controller + admin hostel/warden management.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /* ── Profile ── */

    @GetMapping("/users/me")
    public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getProfile(user));
    }

    @PutMapping("/users/me")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UserProfileDTO dto) {
        return ResponseEntity.ok(userService.updateProfile(user, dto));
    }

    /* ── Admin: Wardens ── */

    @GetMapping("/admin/wardens")
    public ResponseEntity<List<UserProfileDTO>> getWardens() {
        return ResponseEntity.ok(userService.getWardens());
    }

    @PostMapping("/admin/wardens/assign")
    public ResponseEntity<Map<String, Object>> assignWarden(@RequestBody Map<String, Long> body) {
        Long wardenId = body.get("wardenId");
        Long blockId = body.get("blockId");
        return ResponseEntity.ok(userService.assignWarden(wardenId, blockId));
    }

    /* ── Admin: Hostel Blocks ── */

    @GetMapping("/admin/hostel-blocks")
    public ResponseEntity<List<Map<String, Object>>> getHostelBlocks() {
        return ResponseEntity.ok(userService.getHostelBlocks());
    }

    /* ── Public: Hostel blocks for registration ── */

    @GetMapping("/hostel-blocks")
    public ResponseEntity<List<Map<String, Object>>> getHostelBlocksPublic() {
        return ResponseEntity.ok(userService.getHostelBlocks());
    }
}
