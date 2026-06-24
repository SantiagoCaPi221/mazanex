package com.mazanex.profile.service;

import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    @Value("${auth.service.url:http://auth-service:8081}/api/auth/sync-profile")
    private String authSyncUrl;

    // Inyección por constructor: Spring inyectará el Repositorio y el RestTemplate reales,
    // y Mockito inyectará los mocks durante los tests.
    public ProfileService(UserRepository userRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    public User updateProfile(Long id, User data) {
        return userRepository.findById(id).map(user -> {
            if (data.getName() != null && !data.getName().isEmpty()) 
                user.setName(data.getName());
                
            if (data.getAvatarUrl() != null && !data.getAvatarUrl().isEmpty()) 
                user.setAvatarUrl(data.getAvatarUrl());
                
            if (data.getBannerUrl() != null && !data.getBannerUrl().isEmpty()) 
                user.setBannerUrl(data.getBannerUrl());
                
            if (data.getBio() != null) 
                user.setBio(data.getBio());
                
            if (data.getBackgroundUrl() != null && !data.getBackgroundUrl().isEmpty()) 
                user.setBackgroundUrl(data.getBackgroundUrl());
            
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
                User newUser = new User();
                newUser.setId(data.getId());
                newUser.setEmail(data.getEmail());
                newUser.setName(data.getName());
                newUser.setAvatarUrl(data.getAvatarUrl());
                newUser.setBannerUrl(data.getBannerUrl());
                newUser.setBio(data.getBio());
                newUser.setBackgroundUrl(data.getBackgroundUrl());
                
                return userRepository.save(newUser);
            });
    }

    // APLICACIÓN DEL CIRCUIT BREAKER
    @CircuitBreaker(name = "authClient", fallbackMethod = "fallbackSyncWithAuth")
    private void syncWithAuth(User user) {
        restTemplate.postForEntity(authSyncUrl, user, User.class);
    }

    // MÉTODO FALLBACK
    public void fallbackSyncWithAuth(User user, Exception e) {
        System.err.println("Circuit Breaker activo. ms-auth no responde para sincronizar el perfil: " + e.getMessage());
    }

    public List<User> listAll() { return userRepository.findAll(); }
    public void delete(Long id) { userRepository.deleteById(id); }
}