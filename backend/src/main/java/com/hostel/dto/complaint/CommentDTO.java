package com.hostel.dto.complaint;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String text;
    private Long authorId;
    private String authorName;
    private String authorRole;
    private LocalDateTime createdAt;
}
