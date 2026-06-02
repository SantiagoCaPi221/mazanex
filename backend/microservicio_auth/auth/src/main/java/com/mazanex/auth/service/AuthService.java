package com.mazanex.auth.service;

import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User registerUser(User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        // Hashear la contraseña antes de guardar
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public User login(String identifier, String password) {
        Optional<User> u = userRepository.findByEmail(identifier).or(() -> userRepository.findByName(identifier));
        if (u.isPresent()) {
            User user = u.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
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

        // Comparamos la contraseña enviada con la guardada en la base de datos
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        // Si coincide, guardamos la nueva (hasheada)
        user.setPassword(passwordEncoder.encode(newPassword));
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