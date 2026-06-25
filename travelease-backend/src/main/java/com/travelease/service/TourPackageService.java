package com.travelease.service;

import com.travelease.dto.TourPackageRequest;
import com.travelease.dto.TourPackageResponse;
import com.travelease.entity.Destination;
import com.travelease.entity.TourPackage;
import com.travelease.exception.ResourceNotFoundException;
import com.travelease.repository.DestinationRepository;
import com.travelease.repository.TourPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TourPackageService {

    private final TourPackageRepository packageRepository;
    private final DestinationRepository destinationRepository;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private TourPackageResponse toResponse(TourPackage p) {
        return new TourPackageResponse(
                p.getId(),
                p.getTitle(),
                p.getDescription(),
                p.getDestination().getId(),
                p.getDestination().getName(),
                p.getDestination().getCountry(),
                p.getPricePerPerson(),
                p.getDurationDays(),
                p.getMaxSeats(),
                p.getAvailableSeats(),
                p.getCategory(),
                p.getImageUrl()
        );
    }

    private TourPackage findActiveById(Long id) {
        return packageRepository.findById(id)
                .filter(TourPackage::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));
    }

    private Destination findDestination(Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
    }

    // ── Public Operations ─────────────────────────────────────────────────────

    public List<TourPackageResponse> searchAndFilter(
            String search, String category,
            BigDecimal minPrice, BigDecimal maxPrice,
            Long destinationId) {

        return packageRepository
                .searchAndFilter(search, category, minPrice, maxPrice, destinationId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TourPackageResponse getById(Long id) {
        return toResponse(findActiveById(id));
    }

    // ── Admin Operations ──────────────────────────────────────────────────────

    public List<TourPackageResponse> getAllForAdmin() {
        return packageRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TourPackageResponse create(TourPackageRequest request) {
        Destination destination = findDestination(request.getDestinationId());

        TourPackage pkg = new TourPackage();
        mapRequestToEntity(request, pkg, destination);
        // On create, available seats equals max seats
        pkg.setAvailableSeats(request.getMaxSeats());

        return toResponse(packageRepository.save(pkg));
    }

    public TourPackageResponse update(Long id, TourPackageRequest request) {
        TourPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));

        Destination destination = findDestination(request.getDestinationId());

        // Recalculate available seats based on difference in maxSeats
        int seatDiff = request.getMaxSeats() - pkg.getMaxSeats();
        pkg.setAvailableSeats(Math.max(0, pkg.getAvailableSeats() + seatDiff));

        mapRequestToEntity(request, pkg, destination);
        return toResponse(packageRepository.save(pkg));
    }

    public void delete(Long id) {
        TourPackage pkg = packageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found with id: " + id));
        pkg.setActive(false);
        packageRepository.save(pkg);
    }

    // ── Seat Management (used by BookingService later) ────────────────────────

    public void reduceSeats(TourPackage pkg, int count) {
        if (pkg.getAvailableSeats() < count) {
            throw new IllegalArgumentException("Not enough available seats for this package");
        }
        pkg.setAvailableSeats(pkg.getAvailableSeats() - count);
        packageRepository.save(pkg);
    }

    public void restoreSeats(TourPackage pkg, int count) {
        pkg.setAvailableSeats(Math.min(pkg.getAvailableSeats() + count, pkg.getMaxSeats()));
        packageRepository.save(pkg);
    }

    public TourPackage getRawById(Long id) {
        return findActiveById(id);
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private void mapRequestToEntity(TourPackageRequest request,
                                    TourPackage pkg,
                                    Destination destination) {
        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setDestination(destination);
        pkg.setPricePerPerson(request.getPricePerPerson());
        pkg.setDurationDays(request.getDurationDays());
        pkg.setMaxSeats(request.getMaxSeats());
        pkg.setCategory(request.getCategory());
        pkg.setImageUrl(request.getImageUrl());
    }
}
