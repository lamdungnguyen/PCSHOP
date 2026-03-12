package org.example.pcshop.controller;

import org.example.pcshop.dto.ChatRequest;
import org.example.pcshop.dto.ChatResponse;
import org.example.pcshop.entity.Product;
import org.example.pcshop.repository.ProductRepository;
import org.example.pcshop.service.AIService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;
    private final ProductRepository productRepository;

    public AIController(AIService aiService, ProductRepository productRepository) {
        this.aiService = aiService;
        this.productRepository = productRepository;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        List<Product> allProducts = productRepository.findAll();
        List<Product> relevant = aiService.filterRelevantProducts(request.getMessage(), allProducts);
        return aiService.askGemini(request.getMessage(), request.getContext(), relevant, request.getHistory());
    }
}
