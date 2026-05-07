package com.mazanex.auth.controller;

import com.mazanex.auth.model.Usuario;
import com.mazanex.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = authService.registrarUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario loginData) {
        Usuario usuario = authService.validarCredenciales(loginData.getNombre(), loginData.getPassword());
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/usuarios")
    public List<Usuario> listar() {
        return authService.listarTodos();
    }

    @PutMapping("/perfil/{id}")
    public ResponseEntity<Usuario> actualizarPerfil(@PathVariable Long id, @RequestBody Usuario data) {
        Usuario usuarioExistente = authService.listarTodos().stream()
                .filter(u -> u.getId().equals(id))
                .findFirst()
                .orElse(null);

        if (usuarioExistente == null) {
            return ResponseEntity.notFound().build();
        }

        if (data.getNombre() != null) usuarioExistente.setNombre(data.getNombre());
        if (data.getEmail() != null) usuarioExistente.setEmail(data.getEmail());
        if (data.getRol() != null) usuarioExistente.setRol(data.getRol());
        if (data.getAvatarUrl() != null) usuarioExistente.setAvatarUrl(data.getAvatarUrl());
        
        if (data.getPassword() != null && !data.getPassword().isEmpty()) {
            usuarioExistente.setPassword(data.getPassword());
        }

        Usuario actualizado = authService.registrarOActualizar(usuarioExistente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        return authService.eliminar(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/sync-profile")
    public ResponseEntity<Usuario> syncProfile(@RequestBody Usuario data) {
        Usuario actualizado = authService.registrarOActualizar(data);
        return ResponseEntity.ok(actualizado);
    }
}
