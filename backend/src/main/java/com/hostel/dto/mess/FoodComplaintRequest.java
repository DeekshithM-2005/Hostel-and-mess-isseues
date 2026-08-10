package com.hostel.dto.mess;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class FoodComplaintRequest {

    @NotBlank(message = "Meal type is required")
    private String mealType;

    @NotBlank(message = "Description is required")
    private String description;

    private LocalDate date;   // Defaults to today if null
}
