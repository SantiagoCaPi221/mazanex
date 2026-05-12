package com.mazanex.auth.service;

import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User registerUser(User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    public User login(String identifier, String password) {
        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByName(identifier))
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
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
            
            if (data.getPassword() != null && !data.getPassword().isEmpty()) {
                existingUser.setPassword(data.getPassword());
            }
            return userRepository.save(existingUser);
        }).orElse(null);
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}