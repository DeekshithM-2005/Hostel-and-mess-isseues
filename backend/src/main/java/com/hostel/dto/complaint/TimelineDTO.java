package com.hostel.dto.complaint;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TimelineDTO {
    private Long id;
    private String oldStatus;
    private String newStatus;
    private String note;
    private String changedByName;
    private LocalDateTime createdAt;
}
