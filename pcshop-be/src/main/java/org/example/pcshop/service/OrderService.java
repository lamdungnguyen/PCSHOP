package org.example.pcshop.service;

import org.example.pcshop.entity.Order;
import org.example.pcshop.entity.OrderItem;
import org.example.pcshop.entity.Product;
import org.example.pcshop.entity.User;
import org.example.pcshop.repository.OrderRepository;
import org.example.pcshop.repository.ProductRepository;
import org.example.pcshop.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;

        public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                        UserRepository userRepository) {
                this.orderRepository = orderRepository;
                this.productRepository = productRepository;
                this.userRepository = userRepository;
        }

        public List<Order> getMyOrders() {
                User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                return orderRepository.findByUserOrderByCreatedAtDesc(user);
        }

        // Create order with full details
        public Order createOrder(org.example.pcshop.dto.CreateOrderRequest request) {
                User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

                Order order = new Order();
                order.setUser(user);
                order.setStatus("PENDING");

                // Set shipping info
                order.setFullName(request.getFullName());
                order.setPhoneNumber(request.getPhoneNumber());
                order.setShippingAddress(request.getShippingAddress());
                order.setPaymentMethod(request.getPaymentMethod());
                order.setNote(request.getNote());

                List<OrderItem> orderItems = new ArrayList<>();
                BigDecimal total = BigDecimal.ZERO;

                for (Map.Entry<Long, Integer> entry : request.getItems().entrySet()) {
                        Product product = productRepository.findById(entry.getKey())
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Product not found: " + entry.getKey()));

                        OrderItem item = new OrderItem();
                        item.setOrder(order);
                        item.setProduct(product);
                        item.setQuantity(entry.getValue());
                        item.setPrice(product.getPrice());

                        orderItems.add(item);
                        total = total.add(product.getPrice().multiply(BigDecimal.valueOf(entry.getValue())));
                }

                order.setItems(orderItems);
                order.setTotalPrice(total);

                return orderRepository.save(order);
        }

        // Admin: Get all orders
        public List<Order> getAllOrders() {
                return orderRepository.findAll(org.springframework.data.domain.Sort
                                .by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        }

        // Admin: Update Status
        public Order updateStatus(Long id, String status) {
                Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
                order.setStatus(status);
                return orderRepository.save(order);
        }

        // Admin: Delete Order
        public void deleteOrder(Long id) {
                if (!orderRepository.existsById(id)) {
                        throw new RuntimeException("Order not found");
                }
                orderRepository.deleteById(id);
        }
}
