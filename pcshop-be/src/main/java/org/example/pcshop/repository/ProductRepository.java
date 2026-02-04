package org.example.pcshop.repository;

import org.example.pcshop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByCategory_Id(Long categoryId);

    List<Product> findByCategory_IdOrCategory_Parent_Id(Long categoryId, Long parentId);

    List<Product> findByPriceBetween(BigDecimal min, BigDecimal max);
}
