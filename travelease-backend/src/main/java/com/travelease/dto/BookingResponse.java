package com.travelease.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long packageId;
    private String packageTitle;
    private String destinationName;
    private String packageImageUrl;
    private LocalDate travelDate;
    private Integer numTravelers;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime createdAt;
}
