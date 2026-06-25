package com.travelease.service;

import com.travelease.dto.ReviewRequest;
import com.travelease.dto.ReviewResponse;
import com.travelease.entity.Review;
import com.travelease.entity.TourPackage;
import com.travelease.entity.User;
import com.travelease.exception.ResourceNotFoundException;
import com.travelease.repository.ReviewRepository;
import com.travelease.repository.TourPackageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TourPackageRepository packageRepository;
    private final UserService userService;

    private ReviewResponse toResponse(Review r) {
        return new ReviewResponse(
                r.getId(),
                r.getTourPackage().getId(),
                r.getTourPackage().getTitle(),
                r.getUser().getId(),
                r.getUser().getFullName(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt()
        );
    }

    public ReviewResponse submitReview(String email, ReviewRequest request) {
        User user = userService.getByEmail(email);

        TourPackage pkg = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Package not found with id: " + request.getPackageId()));

        if (reviewRepository.existsByUserIdAndTourPackageId(user.getId(), pkg.getId())) {
            throw new IllegalArgumentException(
                    "You have already submitted a review for this package");
        }

        Review review = new Review();
        review.setUser(user);
        review.setTourPackage(pkg);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return toResponse(reviewRepository.save(review));
    }

    public List<ReviewResponse> getReviewsByPackage(Long packageId) {
        return reviewRepository
                .findByTourPackageIdOrderByCreatedAtDesc(packageId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }
}
