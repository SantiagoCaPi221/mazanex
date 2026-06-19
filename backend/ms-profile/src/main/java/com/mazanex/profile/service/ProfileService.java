package com.mazanex.profile.service;

import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.UserRepository;
import com.mazanex.profile.util.SimpleCircuitBreaker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final SimpleCircuitBreaker authSyncCircuitBreaker;

    @Value("${auth.service.url:http://auth-service:8081}/api/auth/sync-profile")
    private String authSyncUrl;

    public ProfileService(UserRepository userRepository,
                          RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.authSyncCircuitBreaker = new SimpleCircuitBreaker(5, 2, 10000);
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
        try {
            authSyncCircuitBreaker.execute(() -> restTemplate.postForEntity(authSyncUrl, user, User.class));
        } catch (Exception e) {
            System.err.println("Sincronización fallida: " + e.getMessage());
        }
    }

    public List<User> listAll() { return userRepository.findAll(); }
    public void delete(Long id) { userRepository.deleteById(id); }
}