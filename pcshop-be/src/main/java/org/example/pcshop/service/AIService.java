package org.example.pcshop.service;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.example.pcshop.entity.Product;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    // Keywords to detect product-related questions
    private static final List<String> PRODUCT_KEYWORDS = Arrays.asList(
            "cpu", "processor", "vi xử lý",
            "gpu", "vga", "graphics", "card đồ họa",
            "ram", "memory", "bộ nhớ",
            "ssd", "hdd", "ổ cứng", "storage",
            "mainboard", "bo mạch",
            "psu", "nguồn", "power supply",
            "case", "vỏ máy",
            "monitor", "màn hình", "screen",
            "keyboard", "bàn phím",
            "mouse", "chuột",
            "headset", "tai nghe",
            "laptop", "gaming", "pc", "máy tính",
            "sản phẩm", "mua", "giá");

    @PostConstruct
    public void checkKey() {
        if (apiKey == null || apiKey.isEmpty()) {
            log.warn("Gemini API Key is missing!");
        } else {
            log.info("Gemini API Key loaded successfully.");
        }
    }

    /**
     * Filter products relevant to the user's question using keyword matching.
     * Caps at 30 products to stay within context limits.
     */
    public List<Product> filterRelevantProducts(String question, List<Product> allProducts) {
        String lowerQuestion = question.toLowerCase();

        boolean isProductRelated = PRODUCT_KEYWORDS.stream()
                .anyMatch(lowerQuestion::contains);

        if (!isProductRelated) {
            return List.of();
        }

        List<Product> filtered = allProducts.stream()
                .filter(p -> {
                    String productName = p.getName() != null ? p.getName().toLowerCase() : "";
                    String categoryName = p.getCategory() != null && p.getCategory().getName() != null
                            ? p.getCategory().getName().toLowerCase()
                            : "";
                    return Arrays.stream(lowerQuestion.split("\\s+"))
                            .anyMatch(word -> word.length() > 2 &&
                                    (productName.contains(word) || categoryName.contains(word)));
                })
                .limit(30)
                .collect(Collectors.toList());

        // Fallback: return top 20 in-stock products if no specific match
        if (filtered.isEmpty()) {
            return allProducts.stream()
                    .filter(p -> p.getQuantity() != null && p.getQuantity() > 0)
                    .limit(20)
                    .collect(Collectors.toList());
        }

        return filtered;
    }

    /**
     * Build compact product list to inject into prompt.
     */
    private String buildProductContext(List<Product> products) {
        if (products.isEmpty())
            return "";

        StringBuilder sb = new StringBuilder(
                "\n\nSẢN PHẨM HIỆN CÓ TRONG SHOP (dùng thông tin này để tư vấn chính xác):\n");
        products.forEach(p -> sb
                .append("- [").append(p.getCategory() != null ? p.getCategory().getName() : "Khác").append("] ")
                .append(p.getName())
                .append(" | Giá: ").append(p.getPrice() != null ? p.getPrice().longValue() : 0).append("₫")
                .append(" | ").append(p.getQuantity() != null && p.getQuantity() > 0 ? "Còn hàng" : "Hết hàng")
                .append("\n"));
        sb.append(
                "(Chỉ tư vấn sản phẩm còn hàng. Nếu hỏi sản phẩm không có trong danh sách, hãy thừa nhận shop chưa có.)\n");
        return sb.toString();
    }

    private String getSystemPrompt(String context) {
        if ("customer_support".equals(context)) {
            return """
                    Bạn là trợ lý AI thân thiện của PCSHOP - cửa hàng công nghệ hàng đầu tại Việt Nam.
                    Hãy luôn trả lời thân thiện, ngắn gọn và chuyên nghiệp.
                    Answer in the same language as the user (Vietnamese or English).

                    THÔNG TIN SHOP:
                    - Tên: PCSHOP
                    - Địa chỉ: Long Biên, Hà Nội, Việt Nam
                    - Hotline: 0904.560.681
                    - Giờ mở cửa: 8:00 - 21:00, Thứ 2 - Chủ nhật
                    - Website: pcshop.vn

                    CHÍNH SÁCH:
                    - Bảo hành: 12-24 tháng tùy sản phẩm
                    - Đổi trả: trong 7 ngày nếu lỗi nhà sản xuất
                    - Giao hàng toàn quốc, miễn phí đơn trên 2 triệu đồng
                    - Thanh toán: tiền mặt, chuyển khoản, thẻ tín dụng

                    Nhiệm vụ của bạn:
                    - Hỗ trợ khách hàng về sản phẩm, đơn hàng, chính sách
                    - Tư vấn sản phẩm dựa trên danh sách sản phẩm thực của shop (nếu có)
                    - Nếu không biết, hướng dẫn khách gọi hotline 0904.560.681

                    STRICTLY RETURN JSON (always exact this structure, never deviate):
                    {
                        "reply": "your response here",
                        "recommendations": []
                    }
                    The "recommendations" field MUST always be an empty array [] for customer support context.
                    NEVER put strings inside recommendations. NEVER add extra fields.
                    """;
        } else {
            return """
                    You are a PC building assistant for PCSHOP.
                    User will ask for a PC build or general hardware questions.
                    Answer in the same language as the user (Vietnamese or English).
                    When recommending components, prefer actual products from the shop's list if provided.

                    STRICTLY RETURN JSON (always exact this structure, never deviate):
                    {
                        "reply": "your response here",
                        "recommendations": [
                            { "category": "CPU", "productName": "Intel Core i5", "price": 5000000 }
                        ]
                    }
                    Each recommendation MUST be an object with "category", "productName", "price" fields.
                    If the user does NOT ask for a build, return "recommendations": [].
                    NEVER put strings inside recommendations. NEVER add extra fields.
                    """;
        }
    }

    public org.example.pcshop.dto.ChatResponse askGemini(String question, String context,
            List<Product> relevantProducts,
            List<org.example.pcshop.dto.ChatRequest.HistoryMessage> history) {
        try {
            String finalUrl = apiUrl + "?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String systemPrompt = getSystemPrompt(context) + buildProductContext(relevantProducts);

            // Cap history at last 10 messages to avoid token overflow
            List<org.example.pcshop.dto.ChatRequest.HistoryMessage> recentHistory = (history != null
                    && history.size() > 10)
                            ? history.subList(history.size() - 10, history.size())
                            : (history != null ? history : List.of());

            java.util.List<Map<String, Object>> contents = new java.util.ArrayList<>();

            // Build multi-turn contents: prepend system prompt to the first user turn
            boolean isFirst = true;
            for (org.example.pcshop.dto.ChatRequest.HistoryMessage msg : recentHistory) {
                String text = isFirst && "user".equals(msg.getRole())
                        ? systemPrompt + "\nUser: " + msg.getText()
                        : msg.getText();
                contents.add(Map.of("role", msg.getRole(), "parts", List.of(Map.of("text", text))));
                isFirst = false;
            }

            // Add current user message (prepend prompt if no history)
            String currentText = isFirst
                    ? systemPrompt + "\nUser: " + question
                    : question;
            contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", currentText))));

            Map<String, Object> body = Map.of("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);

            Map candidate = (Map) ((List) response.getBody().get("candidates")).get(0);
            Map content = (Map) candidate.get("content");
            Map part = (Map) ((List) content.get("parts")).get(0);
            String rawJson = part.get("text").toString();

            if (rawJson.startsWith("```json"))
                rawJson = rawJson.substring(7);
            if (rawJson.startsWith("```"))
                rawJson = rawJson.substring(3);
            if (rawJson.endsWith("```"))
                rawJson = rawJson.substring(0, rawJson.length() - 3);
            rawJson = rawJson.trim();

            log.debug("GEMINI_RESPONSE: {}", rawJson);
            return objectMapper.readValue(rawJson, org.example.pcshop.dto.ChatResponse.class);

        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            org.example.pcshop.dto.ChatResponse errorRes = new org.example.pcshop.dto.ChatResponse();
            errorRes.setReply("Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại hoặc gọi hotline 0904.560.681.");
            errorRes.setRecommendations(List.of());
            return errorRes;
        }
    }
}
