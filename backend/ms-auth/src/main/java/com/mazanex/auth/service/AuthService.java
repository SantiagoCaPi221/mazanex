package com.mazanex.auth.service;

import com.mazanex.auth.dto.UserRequestDto;
import com.mazanex.auth.dto.UserResponseDto;
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
        // Nota para el futuro: Aquí es donde implementarías la encriptación (ej. BCrypt)
        return userRepository.save(user);
    }

    public UserResponseDto login(UserRequestDto user) {
        String identifier = user.email();
        String password = user.password();

        return userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByName(identifier))
                .filter(u -> u.getPassword().equals(password))
                .map(u -> new UserResponseDto(
                    u.getId(),
                    u.getName(),
                    u.getEmail(),
                    u.getPassword(),
                    u.getRole(),
                    u.getAvatarUrl(),
                    u.getBannerUrl(),
                    u.getBio(),
                    u.getBackgroundUrl()
                ))
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
            
        
            return userRepository.save(existingUser);
        }).orElse(null);
    }

    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Comparamos la contraseña enviada con la guardada en la base de datos
        if (!user.getPassword().equals(currentPassword)) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        // Si coincide, guardamos la nueva
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