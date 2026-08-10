package com.hostel.dto.complaint;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComplaintResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String imageUrl;
    private Integer floorNumber;
    private String roomNumber;

    // Student info
    private Long studentId;
    private String studentName;
    private String studentEmail;

    // Hostel info
    private Long hostelBlockId;
    private String hostelBlockName;

    // Warden info
    private Long assignedWardenId;
    private String assignedWardenName;

    private List<CommentDTO> comments;
    private List<TimelineDTO> timeline;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
