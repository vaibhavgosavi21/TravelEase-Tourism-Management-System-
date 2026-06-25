package com.travelease.repository;

import com.travelease.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Booking> findByIdAndUserId(Long bookingId, Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    long countByStatus(Booking.Status status);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0) FROM Booking b WHERE b.status <> :status")
    BigDecimal sumRevenueExcludingStatus(@Param("status") Booking.Status status);

    // Returns last N bookings for the dashboard
    List<Booking> findTop5ByOrderByCreatedAtDesc();
}
