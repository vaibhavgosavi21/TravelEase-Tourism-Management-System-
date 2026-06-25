package com.travelease.repository;

import com.travelease.entity.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface TourPackageRepository extends JpaRepository<TourPackage, Long> {

    // Search + filter with optional parameters
    @Query("""
            SELECT p FROM TourPackage p
            WHERE p.isActive = true
            AND (:search IS NULL OR
                 LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
                 LOWER(p.destination.name) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:category IS NULL OR p.category = :category)
            AND (:minPrice IS NULL OR p.pricePerPerson >= :minPrice)
            AND (:maxPrice IS NULL OR p.pricePerPerson <= :maxPrice)
            AND (:destinationId IS NULL OR p.destination.id = :destinationId)
            ORDER BY p.createdAt DESC
            """)
    List<TourPackage> searchAndFilter(
            @Param("search") String search,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("destinationId") Long destinationId
    );

    List<TourPackage> findByDestinationIdAndIsActiveTrue(Long destinationId);
}
