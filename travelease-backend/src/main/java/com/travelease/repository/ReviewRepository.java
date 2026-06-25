package com.travelease.repository;

import com.travelease.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTourPackageIdOrderByCreatedAtDesc(Long packageId);
    Optional<Review> findByUserIdAndTourPackageId(Long userId, Long packageId);
    boolean existsByUserIdAndTourPackageId(Long userId, Long packageId);
}
