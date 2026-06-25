package com.travelease.controller;

import com.travelease.dto.ApiResponse;
import com.travelease.dto.BookingRequest;
import com.travelease.dto.BookingResponse;
import com.travelease.service.BookingService;
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
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Bookings", description = "Customer booking and admin management")
public class BookingController {

    private final BookingService bookingService;

    // ── Customer Endpoints ────────────────────────────────────────────────────

    @PostMapping("/api/v1/bookings")
    @Operation(summary = "Create a new booking")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookingRequest request) {
        BookingResponse booking = bookingService.createBooking(
                userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", booking));
    }

    @GetMapping("/api/v1/bookings")
    @Operation(summary = "Get all bookings for the logged-in user")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> bookings = bookingService.getMyBookings(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched", bookings));
    }

    @GetMapping("/api/v1/bookings/{id}")
    @Operation(summary = "Get a specific booking by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getMyBookingById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        BookingResponse booking = bookingService.getMyBookingById(
                userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Booking fetched", booking));
    }

    @PutMapping("/api/v1/bookings/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        BookingResponse booking = bookingService.cancelBooking(
                userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", booking));
    }

    // ── Admin Endpoints ───────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/bookings")
    @Operation(summary = "Admin: Get all bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        return ResponseEntity.ok(
                ApiResponse.success("All bookings fetched", bookingService.getAllBookings()));
    }

    @GetMapping("/api/v1/admin/bookings/{id}")
    @Operation(summary = "Admin: Get booking by ID")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Booking fetched", bookingService.getBookingById(id)));
    }

    @PutMapping("/api/v1/admin/bookings/{id}/status")
    @Operation(summary = "Admin: Update booking status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        BookingResponse booking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated", booking));
    }
}
