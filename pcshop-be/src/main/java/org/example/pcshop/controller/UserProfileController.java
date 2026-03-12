package org.example.pcshop.controller;

import org.example.pcshop.entity.User;
import org.example.pcshop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    private final UserRepository userRepository;

    public UserProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@RequestBody User updateData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (updateData.getName() != null) {
             currentUser.setName(updateData.getName());
        }

        if (updateData.getEmail() != null) {
            currentUser.setEmail(updateData.getEmail());
        }

        // Only update password if provided and not empty
        if (updateData.getPassword() != null && !updateData.getPassword().trim().isEmpty()) {
            currentUser.setPassword(updateData.getPassword()); // Use plain text to match project
        }

        User updatedUser = userRepository.save(currentUser);
        return ResponseEntity.ok(updatedUser);
    }
}
