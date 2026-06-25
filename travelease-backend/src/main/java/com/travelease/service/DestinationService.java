package com.travelease.service;

import com.travelease.dto.DestinationRequest;
import com.travelease.dto.DestinationResponse;
import com.travelease.entity.Destination;
import com.travelease.exception.ResourceNotFoundException;
import com.travelease.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DestinationService {

    private final DestinationRepository destinationRepository;

    // ── Helpers ───────────────────────────────────────────────────────────────

    private DestinationResponse toResponse(Destination destination) {
        return new DestinationResponse(
                destination.getId(),
                destination.getName(),
                destination.getCountry(),
                destination.getDescription(),
                destination.getImageUrl()
        );
    }

    private Destination findActiveById(Long id) {
        return destinationRepository.findById(id)
                .filter(Destination::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));
    }

    // ── Public Operations ─────────────────────────────────────────────────────

    public List<DestinationResponse> getAllActive() {
        return destinationRepository.findByIsActiveTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DestinationResponse getById(Long id) {
        return toResponse(findActiveById(id));
    }

    // ── Admin Operations ──────────────────────────────────────────────────────

    public DestinationResponse create(DestinationRequest request) {
        Destination destination = new Destination();
        destination.setName(request.getName());
        destination.setCountry(request.getCountry());
        destination.setDescription(request.getDescription());
        destination.setImageUrl(request.getImageUrl());
        return toResponse(destinationRepository.save(destination));
    }

    public DestinationResponse update(Long id, DestinationRequest request) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));

        destination.setName(request.getName());
        destination.setCountry(request.getCountry());
        destination.setDescription(request.getDescription());
        destination.setImageUrl(request.getImageUrl());

        return toResponse(destinationRepository.save(destination));
    }

    public void delete(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + id));

        // Soft delete — keeps the record, just hides it
        destination.setActive(false);
        destinationRepository.save(destination);
    }

    public List<DestinationResponse> getAllForAdmin() {
        return destinationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }
}
