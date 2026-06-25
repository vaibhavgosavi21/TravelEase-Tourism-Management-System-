package com.travelease.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingMessage {
    private Long bookingId;
    private String customerEmail;
    private String customerName;
    private String packageTitle;
    private String destinationName;
    private LocalDate travelDate;
    private Integer numTravelers;
    private BigDecimal totalPrice;
}
