package org.example.pcshop.dto;

import lombok.Data;
import java.util.Map;

@Data
public class CreateOrderRequest {
    private Map<Long, Integer> items;
    private String fullName;
    private String phoneNumber;
    private String shippingAddress;
    private String paymentMethod;
    private String note;
}
