package com.hostel.dto.user;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String phone;
    private String roomNumber;
    private Long hostelBlockId;
    private String hostelBlockName;
}
