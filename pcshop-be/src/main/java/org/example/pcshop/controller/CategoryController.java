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

    // PUT: update category
    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDetails.getName());
        category.setParent(categoryDetails.getParent());

        return categoryRepository.save(category);
    }

    // DELETE: xóa category
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryRepository.deleteById(id);
    }
}
