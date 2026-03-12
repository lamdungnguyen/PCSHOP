package org.example.pcshop.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private String message;
    private String context; // "build_pc" or "customer_support"
    private List<HistoryMessage> history; // conversation history

    @Data
    public static class HistoryMessage {
        private String role; // "user" or "model"
        private String text;
    }
}
