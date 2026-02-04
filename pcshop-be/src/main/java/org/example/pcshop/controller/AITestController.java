package org.example.pcshop.controller;

import org.example.pcshop.dto.ChatResponse;
import org.example.pcshop.service.AIService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AITestController {

    private final AIService aiService;

    public AITestController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/ai")
    public ChatResponse askAI(@RequestParam String q) {
        return aiService.askGemini(q);
    }
}
