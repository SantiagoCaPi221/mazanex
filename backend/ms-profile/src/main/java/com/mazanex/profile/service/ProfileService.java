package com.mazanex.profile.service;

import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.function.Supplier;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final CircuitBreaker authCircuitBreaker;

    private final String AUTH_SYNC_URL = "https://fullstack4-auth-production.up.railway.app/api/auth/sync-profile";

    @Autowired
    public ProfileService(UserRepository userRepository,
                          RestTemplate restTemplate,
                          CircuitBreaker authCircuitBreaker) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.authCircuitBreaker = authCircuitBreaker;
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
                data.setId(null);
                return userRepository.save(data);
            });
    }

    private void syncWithAuth(User user) {
        Supplier<ResponseEntity<User>> decoratedSupplier = CircuitBreaker
                .decorateSupplier(authCircuitBreaker,
                        () -> restTemplate.postForEntity(AUTH_SYNC_URL, user, User.class));

        try {
            decoratedSupplier.get();
        } catch (CallNotPermittedException ex) {
            System.err.println("Circuit breaker abierto, petición omitida: " + ex.getMessage());
        } catch (Exception e) {
            System.err.println("Sincronización fallida: " + e.getMessage());
        }
    }

    public List<User> listAll() { return userRepository.findAll(); }
    public void delete(Long id) { userRepository.deleteById(id); }
}