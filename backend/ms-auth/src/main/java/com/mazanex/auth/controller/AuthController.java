package com.mazanex.auth.controller;

import com.mazanex.auth.dto.PasswordUpdateDTO;
import com.mazanex.auth.dto.UserRequestDto;
import com.mazanex.auth.model.User;
import com.mazanex.auth.service.AuthService;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerUser(user));
    }

    @PostMapping("/login")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid credentials")
    })
    public ResponseEntity<?> login(@RequestBody UserRequestDto user) {
        // El controlador ahora es un simple intermediario. 
        // Toda la magia del JWT y el empaquetado ocurre en AuthService.
        Map<String, Object> authResponse = authService.login(user);
        
        if (authResponse != null) {
            return ResponseEntity.ok(authResponse);
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

    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @RequestBody PasswordUpdateDTO request) {
        try {
            User updatedUser = authService.updatePassword(id, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar la credencial.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return authService.deleteUser(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}