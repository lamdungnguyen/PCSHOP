package org.example.pcshop.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.example.pcshop.entity.User;
import org.example.pcshop.repository.UserRepository;
import org.example.pcshop.security.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.example.pcshop.entity.Role;
import java.io.IOException;
import java.util.Optional;

@Component
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        // 1️⃣ Lấy user từ Google
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // 2️⃣ Tìm user trong DB
        Optional<User> optionalUser = userRepository.findByEmail(email);

        User user = optionalUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setUsername(email); // Set username to email for Google users
            newUser.setProvider("GOOGLE");
            newUser.setRole(Role.USER);

            // ⚠ BẮT BUỘC – vì DB không cho password null
            newUser.setPassword("OAUTH2_USER");

            return userRepository.save(newUser);
        });

        // Ensure username is set if it was missing (migration for old users)
        if (user.getUsername() == null) {
            user.setUsername(user.getEmail()); // Fallback to email as username
            userRepository.save(user);
        }

        // 3️⃣ TẠO JWT
        String token = jwtUtil.generateToken(user.getUsername());

        log.info("User {} logged in via OAuth2", user.getUsername());

        // 4️⃣ Redirect về FE + token
        response.sendRedirect("http://localhost:5173/login-success?token=" + token);
    }
}
