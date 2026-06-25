package com.travelease.controller;

import com.travelease.dto.ApiResponse;
import com.travelease.dto.ReviewRequest;
import com.travelease.dto.ReviewResponse;
import com.travelease.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Customer reviews and admin management")
public class ReviewController {

    private final ReviewService reviewService;

    // ── Public ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/reviews/package/{packageId}")
    @Operation(summary = "Get all reviews for a package")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getByPackage(
            @PathVariable Long packageId) {
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched",
                reviewService.getReviewsByPackage(packageId)));
    }

    // ── Customer ──────────────────────────────────────────────────────────────

    @PostMapping("/api/v1/reviews")
    @Operation(summary = "Submit a review for a package")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse review = reviewService.submitReview(
                userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted", review));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/reviews")
    @Operation(summary = "Admin: Get all reviews")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched",
                reviewService.getAllReviews()));
    }

    @DeleteMapping("/api/v1/admin/reviews/{id}")
    @Operation(summary = "Admin: Delete a review")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted"));
    }
}
