package org.example.pcshop.controller;

import org.example.pcshop.entity.News;
import org.example.pcshop.repository.NewsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsRepository newsRepository;

    public NewsController(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    // Public: List all news
    @GetMapping
    public List<News> getAll() {
        return newsRepository.findAllByOrderByCreatedAtDesc();
    }

    // Public: Get details
    @GetMapping("/{id}")
    public ResponseEntity<News> getById(@PathVariable Long id) {
        return newsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Create
    @PostMapping
    public News create(@RequestBody News news) {
        news.setCreatedAt(LocalDateTime.now());
        news.setUpdatedAt(LocalDateTime.now());
        return newsRepository.save(news);
    }

    // Admin: Update
    @PutMapping("/{id}")
    public ResponseEntity<News> update(@PathVariable Long id, @RequestBody News newsDetails) {
        return newsRepository.findById(id).map(news -> {
            news.setTitle(newsDetails.getTitle());
            news.setContent(newsDetails.getContent());
            news.setImageUrl(newsDetails.getImageUrl());
            news.setAuthor(newsDetails.getAuthor());
            // UpdatedAt set by PreUpdate or manually
            return ResponseEntity.ok(newsRepository.save(news));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin: Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (newsRepository.existsById(id)) {
            newsRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
