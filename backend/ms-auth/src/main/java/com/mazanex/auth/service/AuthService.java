package com.mazanex.auth.service;

import com.mazanex.auth.config.JwtService;
import com.mazanex.auth.dto.UserRequestDto;
import com.mazanex.auth.dto.UserResponseDto;
import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio encargado de la lógica de autenticación y administración básica de usuarios.
 * Coordina la persistencia, autenticación y sincronización con otros microservicios.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${profile.service.url:http://profile-service:8082}/api/profile/sync")
    private String profileSyncUrl;

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    /**
     * Obtiene todos los usuarios registrados en la base de datos.
     *
     * @return lista de usuarios
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Registra un nuevo usuario si el correo no existe previamente.
     *
     * @param user datos del usuario a crear
     * @return usuario guardado
     * @throws RuntimeException si el correo ya está registrado
     */
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        User savedUser = userRepository.save(user);
        syncWithProfile(savedUser);
        return savedUser;
    }

    /**
     * Sincroniza el usuario creado con el servicio de perfiles.
     *
     * @param user usuario recientemente registrado
     */
    @CircuitBreaker(name = "authService", fallbackMethod = "fallbackSync")
    public void syncWithProfile(User user) {
        try {
            // Al registrar un usuario, aún no hay token. Esta ruta en ms-profile debe ser pública.
            restTemplate.postForEntity(profileSyncUrl, user, User.class);
        } catch (Exception e) {
            // El escudo: Si ms-profile falla, el error se atrapa aquí y NO destruye el registro.
            System.err.println("ADVERTENCIA: El usuario se registró en auth, pero falló la sincronización con ms-profile. Error: " + e.getMessage());
        }
    }

    /**
     * Método de respaldo utilizado por el circuit breaker cuando falla la sincronización.
     *
     * @param user usuario involucrado
     * @param e error capturado
     */
    public void fallbackSync(User user, Throwable e) {
        System.err.println("Circuit Breaker activo: No se pudo sincronizar con ms-profile. " + e.getMessage());
    }

    /**
     * Autentica a un usuario y genera un token JWT si las credenciales son válidas.
     *
     * @param userDto credenciales recibidas desde el cliente
     * @return mapa con token y datos del usuario, o null si falla la autenticación
     */
    public Map<String, Object> login(UserRequestDto userDto) {
        Optional<User> optUser = userRepository.findByEmail(userDto.email())
                .or(() -> userRepository.findByName(userDto.email()));

        if (optUser.isPresent() && optUser.get().getPassword().equals(userDto.password())) {
            User u = optUser.get();
            String token = jwtService.generateToken(u.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", u);
            return response;
        }
        return null;
    }

    /**
     * Actualiza los datos de perfil de un usuario existente.
     *
     * @param id identificador del usuario
     * @param data nuevos datos del usuario
     * @return usuario actualizado, o null si no existe
     */
    public User updateProfile(Long id, User data) {
        return userRepository.findById(id).map(u -> {
            if (data.getName() != null) u.setName(data.getName());
            if (data.getEmail() != null) u.setEmail(data.getEmail());
            if (data.getRole() != null) u.setRole(data.getRole());
            if (data.getAvatarUrl() != null) u.setAvatarUrl(data.getAvatarUrl());
            if (data.getBannerUrl() != null) u.setBannerUrl(data.getBannerUrl());
            if (data.getBio() != null) u.setBio(data.getBio());
            if (data.getBackgroundUrl() != null) u.setBackgroundUrl(data.getBackgroundUrl());
            if (data.getPassword() != null) u.setPassword(data.getPassword());
            return userRepository.save(u);
        }).orElse(null);
    }

    /**
     * Cambia la contraseña de un usuario después de validar la actual.
     *
     * @param userId identificador del usuario
     * @param currentPassword contraseña actual
     * @param newPassword nueva contraseña
     * @return usuario actualizado
     * @throws IllegalArgumentException si la contraseña actual no coincide
     */
    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!user.getPassword().equals(currentPassword)) {
            throw new IllegalArgumentException("Contraseña actual incorrecta");
        }
        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    /**
     * Elimina un usuario si existe.
     *
     * @param id identificador del usuario
     * @return true si se eliminó, false si no existía
     */
    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}