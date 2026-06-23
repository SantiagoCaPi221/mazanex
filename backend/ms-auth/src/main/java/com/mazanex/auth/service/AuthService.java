package com.mazanex.auth.service;

import com.mazanex.auth.config.JwtService;
import com.mazanex.auth.dto.UserRequestDto;
import com.mazanex.auth.dto.UserResponseDto;
import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${profile.service.url:http://profile-service:8082/api/profile/sync}")
    private String profileSyncUrl;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        User savedUser = userRepository.save(user);

        // Evita que fallen los tests o el registro si profile no está disponible
        try {
            syncWithProfile(savedUser);
        } catch (Exception e) {
            System.err.println("No se pudo sincronizar con profile: " + e.getMessage());
        }

        return savedUser;
    }

    @CircuitBreaker(name = "authService", fallbackMethod = "fallbackSync")
    public void syncWithProfile(User user) {

        // En tests Mockito el @Value no se inyecta
        if (profileSyncUrl == null || profileSyncUrl.isBlank()) {
            return;
        }

        restTemplate.postForEntity(profileSyncUrl, user, User.class);
    }

    public void fallbackSync(User user, Exception e) {
        System.err.println(
            "Circuit Breaker activo: No se pudo sincronizar con ms-profile. "
            + e.getMessage()
        );
    }

    // resto del código...
}