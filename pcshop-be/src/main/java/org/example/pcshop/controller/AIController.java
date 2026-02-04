package org.example.pcshop.controller;

import org.example.pcshop.dto.ChatRequest;
import org.example.pcshop.dto.ChatResponse;
import org.example.pcshop.service.AIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return aiService.askGemini(request.getMessage());
    }
}
