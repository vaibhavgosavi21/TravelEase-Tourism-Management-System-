package com.travelease.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
public class DashboardResponse {
    private long totalUsers;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private long pendingBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long completedBookings;
    private long unreadMessages;
    private List<BookingResponse> recentBookings;
}
