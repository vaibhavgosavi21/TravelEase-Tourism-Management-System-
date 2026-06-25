package com.travelease.service;

import com.travelease.dto.BookingResponse;
import com.travelease.dto.DashboardResponse;
import com.travelease.entity.Booking;
import com.travelease.repository.BookingRepository;
import com.travelease.repository.ContactMessageRepository;
import com.travelease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ContactMessageRepository contactRepository;

    public DashboardResponse getSummary() {

        long totalUsers    = userRepository.count();
        long totalBookings = bookingRepository.count();
        long pending       = bookingRepository.countByStatus(Booking.Status.PENDING);
        long confirmed     = bookingRepository.countByStatus(Booking.Status.CONFIRMED);
        long cancelled     = bookingRepository.countByStatus(Booking.Status.CANCELLED);
        long completed     = bookingRepository.countByStatus(Booking.Status.COMPLETED);
        long unreadMsgs    = contactRepository.countByIsReadFalse();

        BigDecimal totalRevenue = bookingRepository
                .sumRevenueExcludingStatus(Booking.Status.CANCELLED);

        List<BookingResponse> recentBookings = bookingRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(b -> new BookingResponse(
                        b.getId(),
                        b.getTourPackage().getId(),
                        b.getTourPackage().getTitle(),
                        b.getTourPackage().getDestination().getName(),
                        b.getTourPackage().getImageUrl(),
                        b.getTravelDate(),
                        b.getNumTravelers(),
                        b.getTotalPrice(),
                        b.getStatus().name(),
                        b.getCreatedAt()
                ))
                .toList();

        return new DashboardResponse(
                totalUsers, totalBookings, totalRevenue,
                pending, confirmed, cancelled, completed,
                unreadMsgs, recentBookings
        );
    }
}
