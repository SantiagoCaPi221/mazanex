package com.mazanex.auth.service;

import com.mazanex.auth.config.JwtService;
import com.mazanex.auth.dto.UserRequestDto;
import com.mazanex.auth.dto.UserResponseDto;
import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
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
    private final RestTemplate restTemplate;
    private final CircuitBreaker profileSyncCircuitBreaker;

    // Busca la URL de profile en properties. Si no existe, asume Docker (profile-service:8082)
    @Value("${profile.service.url:http://profile-service:8082/api/profile/sync}")
    private String profileSyncUrl;

    AuthService(UserRepository userRepository,
                JwtService jwtService,
                RestTemplate restTemplate,
                CircuitBreakerRegistry circuitBreakerRegistry) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.restTemplate = restTemplate;
        this.profileSyncCircuitBreaker = circuitBreakerRegistry.circuitBreaker("ms-auth-profile-sync");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User registerUser(User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        
        // 1. Guardamos en Auth_DB
        User savedUser = userRepository.save(user);

        // 2. Sincronizamos con Profile_DB
        syncWithProfile(savedUser);

        return savedUser;
    }

    // Método para sincronizar con Profile service 
    private void syncWithProfile(User user) {
        Runnable profileSyncTask = CircuitBreaker.decorateRunnable(profileSyncCircuitBreaker, () ->
                restTemplate.postForEntity(profileSyncUrl, user, User.class)
        );

        try {
            System.out.println("Enviando usuario ID " + user.getId() + " a ms-profile...");
            profileSyncTask.run();
            System.out.println("Usuario sincronizado exitosamente con ms-profile.");
        } catch (CallNotPermittedException e) {
            System.err.println("Circuit breaker abierto para ms-profile, sincronización omitida: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error al avisarle a ms-profile: " + e.getMessage());
        }
    }

    public Map<String, Object> getProfileSyncCircuitBreakerStatus() {
        return Map.of(
                "state", profileSyncCircuitBreaker.getState().name(),
                "failureRate", profileSyncCircuitBreaker.getMetrics().getFailureRate(),
                "bufferedCalls", profileSyncCircuitBreaker.getMetrics().getNumberOfBufferedCalls(),
                "failedCalls", profileSyncCircuitBreaker.getMetrics().getNumberOfFailedCalls()
        );
    }

    public Map<String, Object> login(UserRequestDto userDto) {
        String identifier = userDto.email();
        String password = userDto.password();

        Optional<User> optUser = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByName(identifier));

        if (optUser.isPresent() && optUser.get().getPassword().equals(password)) {
            User u = optUser.get();
            
            UserResponseDto userResponse = new UserResponseDto(
                    u.getId(), u.getName(), u.getEmail(), u.getPassword(),
                    u.getRole(), u.getAvatarUrl(), u.getBannerUrl(),
                    u.getBio(), u.getBackgroundUrl()
            );

            String token = jwtService.generateToken(u.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userResponse);

            return response;
        }
        
        return null;
    }

    public User updateProfile(Long id, User data) {
        return userRepository.findById(id).map(existingUser -> {
            if (data.getName() != null) existingUser.setName(data.getName());
            if (data.getEmail() != null) existingUser.setEmail(data.getEmail());
            if (data.getRole() != null) existingUser.setRole(data.getRole());
            if (data.getAvatarUrl() != null) existingUser.setAvatarUrl(data.getAvatarUrl());
            if (data.getBannerUrl() != null) existingUser.setBannerUrl(data.getBannerUrl());
            if (data.getBio() != null) existingUser.setBio(data.getBio());
            if (data.getBackgroundUrl() != null) existingUser.setBackgroundUrl(data.getBackgroundUrl());
            
            return userRepository.save(existingUser);
        }).orElse(null);
    }

    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!user.getPassword().equals(currentPassword)) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}