package com.mazanex.profile.controller;

import com.mazanex.profile.model.User;
import com.mazanex.profile.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@Tag(name = "1. Gestión de Perfiles", description = "Endpoints para la administración de datos de usuario")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PutMapping("/{id}")
    @Operation(
        summary = "Actualizar perfil", 
        description = "Modifica los datos de un usuario existente a partir de su ID."
    )
    public ResponseEntity<User> update(
            @Parameter(description = "ID del usuario a actualizar") @PathVariable Long id, 
            @RequestBody User data) {
        
        User updated = profileService.updateProfile(id, data);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PostMapping("/sync")
    @Operation(
        summary = "Sincronizar perfil", 
        description = "Sincroniza los datos del usuario en la base de datos local."
    )
    public ResponseEntity<User> sync(@RequestBody User data) {
        return ResponseEntity.ok(profileService.syncProfile(data));
    }

    @GetMapping("/list")
    @Operation(
        summary = "Listar todos los perfiles", 
        description = "Obtiene una lista completa de todos los usuarios registrados en el sistema."
    )
    public ResponseEntity<List<User>> listAll() {
        return ResponseEntity.ok(profileService.listAll());
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Eliminar perfil", 
        description = "Elimina permanentemente un perfil de usuario del sistema."
    )
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID del usuario a eliminar") @PathVariable Long id) {
        
        profileService.delete(id);
        return ResponseEntity.noContent().build();
    }
}