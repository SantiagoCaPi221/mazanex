package com.mazanex.auth.controller;

import com.mazanex.auth.dto.PasswordUpdateDTO;
import com.mazanex.auth.model.User;
import com.mazanex.auth.service.AuthService;
import com.mazanex.auth.security.JwtProvider;
import com.mazanex.auth.dto.AuthRequest;
import com.mazanex.auth.dto.AuthResponse;
import com.mazanex.auth.dto.PasswordUpdateDTO;
 import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtProvider jwtProvider;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        User newUser = authService.registerUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest loginData) {
        String identifier = loginData.getUsernameOrEmail();
        User user = authService.login(identifier, loginData.getPassword());
        if (user != null) {
            String token = jwtProvider.generateToken(user.getEmail() != null ? user.getEmail() : user.getName());
            return ResponseEntity.ok(new AuthResponse(token, user));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/users")
    public List<User> list() {
        return authService.getAllUsers();
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable Long id, @RequestBody User data) {
        User updated = authService.updateProfile(id, data);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // --- NUEVO ENDPOINT DE SEGURIDAD ---
    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @Valid @RequestBody PasswordUpdateDTO request) {
        try {
            User updatedUser = authService.updatePassword(id, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            // Error 400 si la clave actual es incorrecta
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Error 500 para fallos del servidor
            return ResponseEntity.internalServerError().body("Error al actualizar la credencial.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return authService.deleteUser(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}