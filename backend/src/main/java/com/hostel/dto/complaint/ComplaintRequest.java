package com.hostel.dto.complaint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;   // ELECTRICAL, PLUMBING, etc.

    @NotBlank(message = "Priority is required")
    private String priority;   // LOW, MEDIUM, HIGH, URGENT

    private Integer floorNumber;
    private String roomNumber;
    private String imageUrl;
}
