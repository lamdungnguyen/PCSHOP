package org.example.pcshop.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    // 🔍 Kiểm tra Spring có nhận key không
    @PostConstruct
    public void checkKey() {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API Key is missing!");
        } else {
            log.info("Gemini API Key loaded successfully.");
        }
    }

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    // ✅ Hàm gọi Gemini JSON
    public org.example.pcshop.dto.ChatResponse askGemini(String question) {
        try {
            // 1️⃣ URL
            String finalUrl = apiUrl + "?key=" + apiKey;

            // 2️⃣ Header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 3️⃣ Prompt Engineering cho JSON
            String systemPrompt = """
                    You are a PC building assistant.
                    User will ask for a PC build or general questions.

                    STRICTLY RETURN JSON in this format:
                    {
                        "reply": "Your friendly text reply here...",
                        "recommendations": [
                            {
                                "category": "CPU",
                                "productName": "Example Core i5",
                                "price": 5000000
                            },
                             {
                                "category": "GPU",
                                "productName": "Example RTX 3060",
                                "price": 8000000
                            }
                        ]
                    }

                    If the user does NOT ask for a build configuration, return an empty list for "recommendations".
                    Do not assume prices if you don't know, but try to estimate common market prices in VND.
                    """;

            String fullPrompt = systemPrompt + "\nUser Question: " + question;

            // 3️⃣ Body
            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", fullPrompt)))));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // 4️⃣ Gọi API
            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);

            // 5️⃣ Lấy text trả về
            Map candidate = (Map) ((List) response.getBody().get("candidates")).get(0);
            Map content = (Map) candidate.get("content");
            Map part = (Map) ((List) content.get("parts")).get(0);
            String rawJson = part.get("text").toString();

            // 6️⃣ Clean JSON (remove ```json wrappers)
            if (rawJson.startsWith("```json")) {
                rawJson = rawJson.substring(7);
            }
            if (rawJson.startsWith("```")) {
                rawJson = rawJson.substring(3);
            }
            if (rawJson.endsWith("```")) {
                rawJson = rawJson.substring(0, rawJson.length() - 3);
            }
            rawJson = rawJson.trim();

            log.debug("GEMINI_RESPONSE: {}", rawJson);

            // 7️⃣ Parse
            return objectMapper.readValue(rawJson, org.example.pcshop.dto.ChatResponse.class);

        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            org.example.pcshop.dto.ChatResponse errorRes = new org.example.pcshop.dto.ChatResponse();
            errorRes.setReply("PC Shop AI Error: " + e.getMessage());
            errorRes.setRecommendations(List.of());
            return errorRes;
        }
    }
}
