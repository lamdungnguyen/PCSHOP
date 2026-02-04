package org.example.pcshop.controller;

import org.example.pcshop.entity.Category;
import org.example.pcshop.repository.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // GET: lấy tất cả category
    @GetMapping
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    // POST: thêm category
    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryRepository.save(category);
    }
}
