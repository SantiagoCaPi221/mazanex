package com.mazanex.profile.service;

import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;

/**
 * Servicio encargado de la persistencia y sincronización de perfiles de usuario.
 * Gestiona la creación, actualización y eliminación de datos de perfil.
 */
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

    /**
     * Actualiza un perfil existente si existe en la base de datos.
     *
     * @param id identificador del usuario
     * @param data datos parciales o completos del perfil
     * @return perfil actualizado o null si no existe
     */
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

    /**
     * Sincroniza un perfil creando uno nuevo o actualizando uno existente por email.
     *
     * @param data datos del perfil a sincronizar
     * @return perfil persistido
     */
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

    // APLICACIÓN DEL CIRCUIT BREAKER Y JWT CON BLINDAJE
    /**
     * Envía una sincronización del perfil al microservicio de autenticación.
     *
     * @param user perfil actualizado
     */
    @CircuitBreaker(name = "authClient", fallbackMethod = "fallbackSyncWithAuth")
    private void syncWithAuth(User user) {
        try {
            // 1. Extraer el token JWT
            String currentToken = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
            
            // 2. Preparar cabeceras
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setBearerAuth(currentToken);
            
            // 3. Empaquetar y enviar (Fíjate que aquí usamos authSyncUrl)
            org.springframework.http.HttpEntity<User> requestEntity = new org.springframework.http.HttpEntity<>(user, headers);
            restTemplate.exchange(authSyncUrl, org.springframework.http.HttpMethod.POST, requestEntity, User.class);
            
        } catch (Exception e) {
            // El escudo: Si ms-auth falla, el error se atrapa aquí y NO destruye el guardado.
            System.err.println("ADVERTENCIA: El perfil se guardó, pero falló la sincronización con ms-auth. Error: " + e.getMessage());
        }
    }

    // MÉTODO FALLBACK (Cambiar Exception a Throwable)
    /**
     * Método de respaldo para la sincronización con auth cuando el circuito está abierto.
     *
     * @param user perfil afectado
     * @param e error capturado
     */
    public void fallbackSyncWithAuth(User user, Throwable e) {
        System.err.println("Circuit Breaker activo: No se pudo sincronizar con ms-auth. " + e.getMessage());
    }

    /**
     * Devuelve todos los perfiles almacenados.
     *
     * @return lista de perfiles
     */
    public List<User> listAll() { return userRepository.findAll(); }

    /**
     * Elimina un perfil por identificador.
     *
     * @param id identificador del perfil a eliminar
     */
    public void delete(Long id) { userRepository.deleteById(id); }
}