package org.example.pcshop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "banners")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;
    private String link;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'HOME_SLIDER'")
    private String section; // HOME_SLIDER, HOME_RIGHT_TOP, HOME_RIGHT_BOTTOM, HOME_WIDE_STRIP

    private boolean active = true;
    private int displayOrder;
}
