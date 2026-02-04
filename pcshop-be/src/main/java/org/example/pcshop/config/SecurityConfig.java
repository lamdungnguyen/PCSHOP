package org.example.pcshop.config;

import org.example.pcshop.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        private final OAuth2LoginSuccessHandler successHandler;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(
                        OAuth2LoginSuccessHandler successHandler,
                        JwtAuthenticationFilter jwtAuthenticationFilter) {
                this.successHandler = successHandler;
                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                // =========================
                                // BASIC
                                // =========================
                                .cors(Customizer.withDefaults())
                                .csrf(csrf -> csrf.disable())

                                // =========================
                                // AUTHORIZATION
                                // =========================
                                .authorizeHttpRequests(auth -> auth

                                                // ✅ AI API – PUBLIC THẬT SỰ
                                                .requestMatchers(HttpMethod.POST, "/api/ai/**").permitAll()

                                                // ✅ AUTH (Login/Register PUBLIC, /me PRIVATE)
                                                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()

                                                // ✅ PUBLIC API
                                                .requestMatchers(
                                                                "/",
                                                                "/api/products/**",
                                                                "/api/categories/**",
                                                                "/uploads/**",
                                                                "/api/upload/**", // Made Public as requested
                                                                "/api/banners/**", // Made Public: Allow viewing all
                                                                                   // banners
                                                                "/api/banners/active") // Added active banners as public
                                                .permitAll()

                                                // 🔐 ADMIN
                                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/banners/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/banners/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/banners/**").hasRole("ADMIN")

                                                // 🔐 USER & ADMIN
                                                .requestMatchers("/api/orders/all").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/orders/*/status")
                                                .hasRole("ADMIN")
                                                .requestMatchers("/api/orders/**").authenticated()

                                                // ✅ Allow OPTIONS for CORS preflight
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                // 🔐 CÒN LẠI BẮT BUỘC AUTH
                                                .anyRequest().authenticated())

                                // =========================
                                // 401 JSON (KHÔNG REDIRECT)
                                // =========================
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                                        response.setContentType("application/json");
                                                        response.getWriter().write("{\"error\":\"Unauthorized\"}");
                                                }))

                                // =========================
                                // OAUTH2 – CHỈ CHO WEB
                                // =========================
                                .oauth2Login(oauth -> oauth
                                                .successHandler(successHandler))

                                // =========================
                                // JWT FILTER
                                // =========================
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        // =========================
        // CORS
        // =========================
        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();

                configuration.setAllowedOrigins(
                                java.util.List.of(
                                                "http://localhost:5173",
                                                "http://localhost:5174"));
                configuration.setAllowedMethods(
                                java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(java.util.List.of("*"));
                configuration.setAllowCredentials(true);

                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);

                return source;
        }
}
