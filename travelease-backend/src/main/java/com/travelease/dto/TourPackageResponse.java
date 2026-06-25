package com.travelease.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class TourPackageResponse {
    private Long id;
    private String title;
    private String description;
    private Long destinationId;
    private String destinationName;
    private String country;
    private BigDecimal pricePerPerson;
    private Integer durationDays;
    private Integer maxSeats;
    private Integer availableSeats;
    private String category;
    private String imageUrl;
}
