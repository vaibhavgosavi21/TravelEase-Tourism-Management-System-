package com.travelease.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String profileImage;
    private String role;
    private boolean isActive;
    private LocalDateTime createdAt;
}
