package com.travelease.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TourPackageRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must not exceed 150 characters")
    private String title;

    private String description;

    @NotNull(message = "Destination ID is required")
    private Long destinationId;

    @NotNull(message = "Price per person is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal pricePerPerson;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer durationDays;

    @NotNull(message = "Max seats is required")
    @Min(value = 1, message = "Max seats must be at least 1")
    private Integer maxSeats;

    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    private String imageUrl;
}
