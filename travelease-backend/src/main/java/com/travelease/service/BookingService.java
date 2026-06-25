package com.travelease.service;

import com.travelease.dto.BookingMessage;
import com.travelease.dto.BookingRequest;
import com.travelease.dto.BookingResponse;
import com.travelease.entity.Booking;
import com.travelease.entity.TourPackage;
import com.travelease.entity.User;
import com.travelease.exception.ResourceNotFoundException;
import com.travelease.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourPackageService packageService;
    private final UserService userService;
    private final SqsService sqsService;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
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
        );
    }

    // ── Customer Operations ───────────────────────────────────────────────────

    @Transactional
    public BookingResponse createBooking(String email, BookingRequest request) {
        User user = userService.getByEmail(email);
        TourPackage pkg = packageService.getRawById(request.getPackageId());

        // Check seat availability
        if (pkg.getAvailableSeats() < request.getNumTravelers()) {
            throw new IllegalArgumentException(
                    "Only " + pkg.getAvailableSeats() + " seats available for this package");
        }

        // Calculate total price
        BigDecimal totalPrice = pkg.getPricePerPerson()
                .multiply(BigDecimal.valueOf(request.getNumTravelers()));

        // Save booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTourPackage(pkg);
        booking.setTravelDate(request.getTravelDate());
        booking.setNumTravelers(request.getNumTravelers());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(Booking.Status.PENDING);

        Booking saved = bookingRepository.save(booking);

        // Reduce available seats
        packageService.reduceSeats(pkg, request.getNumTravelers());

        // Send to SQS asynchronously
        sqsService.sendBookingMessage(new BookingMessage(
                saved.getId(),
                user.getEmail(),
                user.getFullName(),
                pkg.getTitle(),
                pkg.getDestination().getName(),
                request.getTravelDate(),
                request.getNumTravelers(),
                totalPrice
        ));

        return toResponse(saved);
    }

    public List<BookingResponse> getMyBookings(String email) {
        User user = userService.getByEmail(email);
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BookingResponse getMyBookingById(String email, Long bookingId) {
        User user = userService.getByEmail(email);
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return toResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(String email, Long bookingId) {
        User user = userService.getByEmail(email);
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == Booking.Status.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }
        if (booking.getStatus() == Booking.Status.COMPLETED) {
            throw new IllegalArgumentException("Completed bookings cannot be cancelled");
        }

        booking.setStatus(Booking.Status.CANCELLED);
        bookingRepository.save(booking);

        // Restore seats back to the package
        packageService.restoreSeats(booking.getTourPackage(), booking.getNumTravelers());

        return toResponse(booking);
    }

    // ── Admin Operations ──────────────────────────────────────────────────────

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BookingResponse getBookingById(Long id) {
        return toResponse(bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id)));
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        try {
            booking.setStatus(Booking.Status.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status +
                    ". Valid values are: PENDING, CONFIRMED, CANCELLED, COMPLETED");
        }

        return toResponse(bookingRepository.save(booking));
    }
}
