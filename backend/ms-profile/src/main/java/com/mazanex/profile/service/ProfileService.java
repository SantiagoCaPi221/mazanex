package com.mazanex.profile.service;

import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    // Busca "auth.service.url" en application.properties. 
    // Si no lo encuentra, usa "http://localhost:8081" por defecto.
    @Value("${auth.service.url:http://auth-service:8081}/api/auth/sync-profile")
    private String authSyncUrl;

    private final RestTemplate restTemplate = new RestTemplate();

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
                return userRepository.save(data);
            });
    }

    private void syncWithAuth(User user) {
        try {
            // Usamos la variable dinámica que declaramos arriba
            restTemplate.postForEntity(authSyncUrl, user, User.class);
        } catch (Exception e) {
            System.err.println("Sincronización fallida: " + e.getMessage());
        }
    }

    public List<User> listAll() { return userRepository.findAll(); }
    public void delete(Long id) { userRepository.deleteById(id); }
}