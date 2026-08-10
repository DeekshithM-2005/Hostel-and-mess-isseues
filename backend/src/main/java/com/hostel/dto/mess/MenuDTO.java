package com.hostel.dto.mess;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class MenuDTO {
    private Long id;
    private String dayOfWeek;
    private String mealType;
    private String items;
    private boolean active;
}
