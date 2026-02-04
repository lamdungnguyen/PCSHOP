package org.example.pcshop.controller;

import org.example.pcshop.entity.Role;
import org.example.pcshop.entity.User;
import org.example.pcshop.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class AuthController {
    @GetMapping("/me")
    public User me(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }

    private final UserRepository userRepository;
    private final org.example.pcshop.security.JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, org.example.pcshop.security.JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            String token = jwtUtil.generateToken(user.get().getUsername());
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "role", user.get().getRole(),
                    "username", user.get().getUsername(),
                    "id", user.get().getId(),
                    "token", token));
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        user.setRole(Role.USER); // Default role
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }
}
