package com.travelease.controller;

import com.travelease.dto.ApiResponse;
import com.travelease.dto.DestinationRequest;
import com.travelease.dto.DestinationResponse;
import com.travelease.service.DestinationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Destinations", description = "Browse destinations and admin management")
public class DestinationController {

    private final DestinationService destinationService;

    // ── Public Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/v1/destinations")
    @Operation(summary = "Get all active destinations")
    public ResponseEntity<ApiResponse<List<DestinationResponse>>> getAllDestinations() {
        return ResponseEntity.ok(
                ApiResponse.success("Destinations fetched", destinationService.getAllActive()));
    }

    @GetMapping("/api/v1/destinations/{id}")
    @Operation(summary = "Get destination by ID")
    public ResponseEntity<ApiResponse<DestinationResponse>> getDestinationById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Destination fetched", destinationService.getById(id)));
    }

    // ── Admin Endpoints ───────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/destinations")
    @Operation(summary = "Admin: Get all destinations including inactive")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<DestinationResponse>>> getAllForAdmin() {
        return ResponseEntity.ok(
                ApiResponse.success("All destinations fetched", destinationService.getAllForAdmin()));
    }

    @PostMapping("/api/v1/admin/destinations")
    @Operation(summary = "Admin: Create a new destination")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<DestinationResponse>> createDestination(
            @Valid @RequestBody DestinationRequest request) {
        DestinationResponse created = destinationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Destination created", created));
    }

    @PutMapping("/api/v1/admin/destinations/{id}")
    @Operation(summary = "Admin: Update a destination")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<DestinationResponse>> updateDestination(
            @PathVariable Long id,
            @Valid @RequestBody DestinationRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Destination updated", destinationService.update(id, request)));
    }

    @DeleteMapping("/api/v1/admin/destinations/{id}")
    @Operation(summary = "Admin: Soft delete a destination")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deleteDestination(@PathVariable Long id) {
        destinationService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Destination deleted"));
    }
}
