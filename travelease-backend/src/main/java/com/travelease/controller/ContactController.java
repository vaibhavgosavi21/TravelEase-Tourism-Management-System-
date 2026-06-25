package com.travelease.controller;

import com.travelease.dto.ApiResponse;
import com.travelease.dto.ContactRequest;
import com.travelease.dto.ContactResponse;
import com.travelease.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Contact", description = "Contact form and admin management")
public class ContactController {

    private final ContactService contactService;

    // ── Public ────────────────────────────────────────────────────────────────

    @PostMapping("/api/v1/contact")
    @Operation(summary = "Submit a contact message")
    public ResponseEntity<ApiResponse<Void>> submit(
            @Valid @RequestBody ContactRequest request) {
        contactService.submit(request);
        return ResponseEntity.ok(
                ApiResponse.success("Message sent. We will get back to you soon."));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/contact")
    @Operation(summary = "Admin: Get all contact messages")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<List<ContactResponse>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("Messages fetched", contactService.getAll()));
    }

    @PutMapping("/api/v1/admin/contact/{id}/read")
    @Operation(summary = "Admin: Mark a contact message as read")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<ContactResponse>> markAsRead(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Marked as read", contactService.markAsRead(id)));
    }

    @GetMapping("/api/v1/admin/contact/unread-count")
    @Operation(summary = "Admin: Get count of unread messages")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        return ResponseEntity.ok(
                ApiResponse.success("Unread count fetched", contactService.getUnreadCount()));
    }
}
