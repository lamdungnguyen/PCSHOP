package org.example.pcshop.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatResponse {
    private String reply;
    private List<ProductRecommendation> recommendations;

    @Data
    public static class ProductRecommendation {
        private String category;
        private String productName;
        private Double price;
    }
}
