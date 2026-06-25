package com.travelease.controller;

import com.travelease.dto.ApiResponse;
import com.travelease.dto.TourPackageRequest;
import com.travelease.dto.TourPackageResponse;
import com.travelease.service.TourPackageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Tour Packages", description = "Browse packages and admin management")
public class TourPackageController {

    private final TourPackageService packageService;

    // ── Public Endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/v1/packages")
    @Operation(summary = "Search and filter tour packages")
    public ResponseEntity<ApiResponse<List<TourPackageResponse>>> getPackages(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Long destinationId) {

        List<TourPackageResponse> packages =
                packageService.searchAndFilter(search, category, minPrice, maxPrice, destinationId);
        return ResponseEntity.ok(ApiResponse.success("Packages fetched", packages));
    }

    @GetMapping("/api/v1/packages/{id}")
    @Operation(summary = "Get tour package by ID")
    public ResponseEntity<ApiResponse<TourPackageResponse>> getPackageById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Package fetched", packageService.getById(id)));
    }

    // ── Admin Endpoints ───────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/packages")
    @Operation(summary = "Admin: Get all packages including inactive")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<TourPackageResponse>>> getAllForAdmin() {
        return ResponseEntity.ok(
                ApiResponse.success("All packages fetched", packageService.getAllForAdmin()));
    }

    @PostMapping("/api/v1/admin/packages")
    @Operation(summary = "Admin: Create a new tour package")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<TourPackageResponse>> createPackage(
            @Valid @RequestBody TourPackageRequest request) {
        TourPackageResponse created = packageService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Package created", created));
    }

    @PutMapping("/api/v1/admin/packages/{id}")
    @Operation(summary = "Admin: Update a tour package")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<TourPackageResponse>> updatePackage(
            @PathVariable Long id,
            @Valid @RequestBody TourPackageRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Package updated", packageService.update(id, request)));
    }

    @DeleteMapping("/api/v1/admin/packages/{id}")
    @Operation(summary = "Admin: Soft delete a tour package")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Void>> deletePackage(@PathVariable Long id) {
        packageService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Package deleted"));
    }
}
