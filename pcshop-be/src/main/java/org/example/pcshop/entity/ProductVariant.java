package org.example.pcshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String color; // e.g., "Red", "Blue", "Black"

    @Column(columnDefinition = "TEXT")
    private String specifications; // JSON or detailed text: e.g., "RAM: 16GB, SSD: 512GB"

    private BigDecimal price; // Specific price for this variant

    private Integer stockQuantity; // Specific stock for this variant

    private String imageUrl; // Specific image for this variant

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference // Prevent infinite recursion
    private Product product;
}
