package com.mazanex.auth.service;

import com.mazanex.auth.config.JwtService;
import com.mazanex.auth.dto.UserRequestDto;
import com.mazanex.auth.dto.UserResponseDto;
import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
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
    
    @Value("${profile.service.url:http://profile-service:8082}/api/profile/sync")
    private String profileSyncUrl;

    AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.email())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Al ser inmutable, si el rol viene vacío, creamos una copia con el rol por defecto
        User userToSave = user;
        if (user.role() == null || user.role().isEmpty()) {
            userToSave = new User(
                user.id(), user.name(), user.email(), user.password(),
                "USER", user.avatarUrl(), user.bannerUrl(), user.bio(), user.backgroundUrl()
            );
        }
        
        User savedUser = userRepository.save(userToSave);
        syncWithProfile(savedUser);
        return savedUser;
    }

    private void syncWithProfile(User user) {
        try {
            System.out.println("Enviando usuario ID " + user.id() + " a ms-profile...");
            restTemplate.postForEntity(profileSyncUrl, user, User.class);
            System.out.println("Usuario sincronizado exitosamente con ms-profile.");
        } catch (Exception e) {
            System.err.println("Error al avisarle a ms-profile: " + e.getMessage());
        }
    }

    public Map<String, Object> login(UserRequestDto userDto) {
        String identifier = userDto.email();
        String password = userDto.password();

        Optional<User> optUser = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByName(identifier));

        if (optUser.isPresent() && optUser.get().password().equals(password)) {
            User u = optUser.get();
            
            UserResponseDto userResponse = new UserResponseDto(
                u.id(), u.name(), u.email(), u.password(),
                u.role(), u.avatarUrl(), u.bannerUrl(), u.bio(), u.backgroundUrl()
            );

            String token = jwtService.generateToken(u.email());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userResponse);

            return response;
        }
        
        return null;
    }

    public User updateProfile(Long id, User data) {
        return userRepository.findById(id).map(existingUser -> {
            // Recreamos el objeto con los datos modificados (Patrón Wither conceptual)
            User updatedUser = new User(
                existingUser.id(),
                data.name() != null ? data.name() : existingUser.name(),
                data.email() != null ? data.email() : existingUser.email(),
                existingUser.password(), // La contraseña se maneja en su propio endpoint
                data.role() != null ? data.role() : existingUser.role(),
                data.avatarUrl() != null ? data.avatarUrl() : existingUser.avatarUrl(),
                data.bannerUrl() != null ? data.bannerUrl() : existingUser.bannerUrl(),
                data.bio() != null ? data.bio() : existingUser.bio(),
                data.backgroundUrl() != null ? data.backgroundUrl() : existingUser.backgroundUrl()
            );
            
            return userRepository.save(updatedUser);
        }).orElse(null);
    }

    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!user.password().equals(currentPassword)) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        // Generamos un nuevo record con la contraseña cambiada
        User updatedUser = new User(
            user.id(), user.name(), user.email(), newPassword,
            user.role(), user.avatarUrl(), user.bannerUrl(), user.bio(), user.backgroundUrl()
        );
        
        return userRepository.save(updatedUser);
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}