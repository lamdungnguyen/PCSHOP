package org.example.pcshop.controller;

import org.example.pcshop.entity.Category;
import org.example.pcshop.entity.Product;
import org.example.pcshop.repository.CategoryRepository;
import org.example.pcshop.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/products")

public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductController(ProductRepository productRepository,
            CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new RuntimeException("Category is required");
        }

        Category category = categoryRepository
                .findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setCategory(category);

        // Link images to product
        if (product.getImages() != null) {
            product.getImages().forEach(img -> img.setProduct(product));
        }

        return productRepository.save(product);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Product not found");
        }
        productRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Product update(
            @PathVariable Long id,
            @RequestBody Product newProduct) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (newProduct.getCategory() != null && newProduct.getCategory().getId() != null) {
            Category category = categoryRepository
                    .findById(newProduct.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        product.setName(newProduct.getName());
        product.setPrice(newProduct.getPrice());
        product.setQuantity(newProduct.getQuantity());
        product.setDescription(newProduct.getDescription());
        product.setImageUrl(newProduct.getImageUrl());

        if (newProduct.getImages() != null) {
            product.getImages().clear();
            newProduct.getImages().forEach(img -> {
                img.setProduct(product);
                product.getImages().add(img);
            });
        }

        return productRepository.save(product);
    }

    @GetMapping("/search")
    public List<Product> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        if (name != null) {
            return productRepository.findByNameContainingIgnoreCase(name);
        }

        if (categoryId != null) {
            return productRepository.findByCategory_IdOrCategory_Parent_Id(categoryId, categoryId);
        }

        if (minPrice != null && maxPrice != null) {
            return productRepository.findByPriceBetween(minPrice, maxPrice);
        }

        return productRepository.findAll();
    }

}
