package com.hostel.dto.notification;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String title;
    private String message;
    private String type;
    private boolean read;
    private Long referenceId;
    private LocalDateTime createdAt;
}
