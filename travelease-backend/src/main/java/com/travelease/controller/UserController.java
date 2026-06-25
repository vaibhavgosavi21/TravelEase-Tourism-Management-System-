package com.travelease.controller;

import com.travelease.dto.*;
import com.travelease.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and admin user management")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    // ── Customer: Profile ─────────────────────────────────────────────────────

    @GetMapping("/api/v1/users/me")
    @Operation(summary = "Get logged-in user profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserProfileResponse profile = userService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", profile));
    }

    @PutMapping("/api/v1/users/me")
    @Operation(summary = "Update logged-in user profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse updated = userService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", updated));
    }

    @PutMapping("/api/v1/users/me/change-password")
    @Operation(summary = "Change password for logged-in user")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    // ── Admin: User Management ────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/users")
    @Operation(summary = "Admin: Get all users")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    @GetMapping("/api/v1/admin/users/{id}")
    @Operation(summary = "Admin: Get user by ID")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserById(@PathVariable Long id) {
        UserProfileResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User fetched", user));
    }

    @PutMapping("/api/v1/admin/users/{id}/toggle-status")
    @Operation(summary = "Admin: Enable or disable a user account")
    public ResponseEntity<ApiResponse<UserProfileResponse>> toggleUserStatus(@PathVariable Long id) {
        UserProfileResponse user = userService.toggleUserStatus(id);
        String message = user.isActive() ? "User enabled" : "User disabled";
        return ResponseEntity.ok(ApiResponse.success(message, user));
    }
}
