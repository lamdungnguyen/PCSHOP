package org.example.pcshop.controller;

import org.example.pcshop.entity.Product;
import org.example.pcshop.entity.Review;
import org.example.pcshop.entity.User;
import org.example.pcshop.repository.ProductRepository;
import org.example.pcshop.repository.ReviewRepository;
import org.example.pcshop.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, ProductRepository productRepository,
            UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/product/{productId}")
    public List<Review> getByProduct(@PathVariable Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    @PostMapping
    public Review create(@RequestBody Map<String, Object> payload) {
        Long productId = Long.valueOf(payload.get("productId").toString());
        Long userId = Long.valueOf(payload.get("userId").toString());
        String content = (String) payload.get("content");
        int rating = Integer.parseInt(payload.get("rating").toString());

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setContent(content);
        review.setRating(rating);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }
}
