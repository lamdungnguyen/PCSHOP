package org.example.pcshop.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final org.example.pcshop.repository.UserRepository userRepository;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, org.example.pcshop.repository.UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Removed manual skip block. Let SecurityConfig handle authorization.
        // This ensures filter runs and logs for all requests, making debugging easier.

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtUtil.isTokenValid(token)) {
                    String username = jwtUtil.extractUsername(token);
                    logger.info("JWT Filter: Processing token for username: {}, Path: {}", username, path);

                    if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        var userOptional = userRepository.findByUsername(username);
                        if (userOptional.isPresent()) {
                            org.example.pcshop.entity.User user = userOptional.get();

                            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                    user,
                                    null, // Credentials
                                    user.getAuthorities());

                            authentication.setDetails(
                                    new WebAuthenticationDetailsSource().buildDetails(request));

                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            logger.info("JWT Filter: Successfully authenticated user: {}", username);
                        } else {
                            logger.warn("JWT Filter: Token valid but User not found in DB for username: {}", username);
                        }
                    }
                } else {
                    logger.warn("JWT Filter: Invalid Token for path: {}", path);
                }
            } catch (Exception e) {
                logger.error("JWT Filter: Error validating token: {}", e.getMessage());
            }
        } else {
            // Log for non-public paths might be noisy, but useful for debugging 401s
            if (!path.startsWith("/uploads/") && !path.startsWith("/css/") && !path.startsWith("/js/")) {
                logger.debug("JWT Filter: No Authorization header found for path: {}", path);
            }
        }

        filterChain.doFilter(request, response);
    }
}
