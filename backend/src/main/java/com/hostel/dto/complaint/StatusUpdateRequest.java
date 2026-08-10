package com.hostel.dto.complaint;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class StatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;  // IN_REVIEW, IN_PROGRESS, RESOLVED, ESCALATED

    private String note;    // Optional note for the timeline entry
}
