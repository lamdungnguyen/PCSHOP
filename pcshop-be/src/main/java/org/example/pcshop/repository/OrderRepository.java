package org.example.pcshop.repository;

import org.example.pcshop.entity.Order;
import org.example.pcshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
