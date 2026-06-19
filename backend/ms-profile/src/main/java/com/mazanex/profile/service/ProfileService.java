package com.mazanex.profile.service;

import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final CircuitBreaker authSyncCircuitBreaker;

    @Value("${auth.service.url:http://auth-service:8081/api/auth/sync-profile}")
    private String authSyncUrl;

    public ProfileService(UserRepository userRepository,
                          RestTemplate restTemplate,
                          CircuitBreakerRegistry circuitBreakerRegistry) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.authSyncCircuitBreaker = circuitBreakerRegistry.circuitBreaker("ms-profile-auth-sync");
    }

    public User updateProfile(Long id, User data) {
        return userRepository.findById(id).map(user -> {
            if (data.getName() != null) user.setName(data.getName());
            if (data.getAvatarUrl() != null) user.setAvatarUrl(data.getAvatarUrl());
            if (data.getBannerUrl() != null) user.setBannerUrl(data.getBannerUrl());
            if (data.getBio() != null) user.setBio(data.getBio());
            if (data.getBackgroundUrl() != null) user.setBackgroundUrl(data.getBackgroundUrl());
            
            User saved = userRepository.save(user);
            syncWithAuth(saved); 
            return saved;
        }).orElse(null);
    }

    public User syncProfile(User data) {
        return userRepository.findByEmail(data.getEmail())
            .map(existing -> {
                existing.setName(data.getName());
                existing.setAvatarUrl(data.getAvatarUrl());
                existing.setBannerUrl(data.getBannerUrl());
                if (data.getBio() != null) existing.setBio(data.getBio());
                if (data.getBackgroundUrl() != null) existing.setBackgroundUrl(data.getBackgroundUrl());
                return userRepository.save(existing);
            })
            .orElseGet(() -> {
                // 🔥 SOLUCIÓN: Creamos un objeto nuevo y forzamos sus datos, 
                // asegurándonos de que el ID manual se asigne correctamente.
                User newUser = new User();
                newUser.setId(data.getId()); // Forzamos el ID que viene de ms-auth
                newUser.setEmail(data.getEmail());
                newUser.setName(data.getName());
                newUser.setAvatarUrl(data.getAvatarUrl());
                newUser.setBannerUrl(data.getBannerUrl());
                newUser.setBio(data.getBio());
                newUser.setBackgroundUrl(data.getBackgroundUrl());
                
                return userRepository.save(newUser);
            });
    }

    private void syncWithAuth(User user) {
        Runnable authSyncTask = CircuitBreaker.decorateRunnable(authSyncCircuitBreaker, () ->
                restTemplate.postForEntity(authSyncUrl, user, User.class)
        );

        try {
            authSyncTask.run();
        } catch (CallNotPermittedException e) {
            System.err.println("Circuit breaker abierto para ms-auth, sincronización omitida: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Sincronización fallida: " + e.getMessage());
        }
    }

    public Map<String, Object> getAuthSyncCircuitBreakerStatus() {
        return Map.of(
                "state", authSyncCircuitBreaker.getState().name(),
                "failureRate", authSyncCircuitBreaker.getMetrics().getFailureRate(),
                "bufferedCalls", authSyncCircuitBreaker.getMetrics().getNumberOfBufferedCalls(),
                "failedCalls", authSyncCircuitBreaker.getMetrics().getNumberOfFailedCalls()
        );
    }

    public List<User> listAll() { return userRepository.findAll(); }
    public void delete(Long id) { userRepository.deleteById(id); }
}