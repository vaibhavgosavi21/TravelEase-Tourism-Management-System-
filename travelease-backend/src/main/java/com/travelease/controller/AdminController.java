package com.travelease.controller;

import com.travelease.dto.ApiResponse;
import com.travelease.dto.DashboardResponse;
import com.travelease.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin Dashboard", description = "Admin summary and overview")
public class AdminController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "Admin: Get dashboard summary with all key metrics")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        return ResponseEntity.ok(
                ApiResponse.success("Dashboard data fetched", dashboardService.getSummary()));
    }
}
