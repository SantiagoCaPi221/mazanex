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
        description = "Modifica los datos de un usuario existente."
    )
    public ResponseEntity<User> update(
            @Parameter(description = "ID del usuario") @PathVariable Long id, 
            @RequestBody User data) {
        
        System.out.println("DEBUG: Recibida petición PUT en /api/profile/" + id);
        
        User updated = profileService.updateProfile(id, data);
        
        // Si el usuario no existe en profile_db, intentamos un registro rápido
        if (updated == null) {
            System.out.println("DEBUG: Usuario no encontrado, iniciando sincronización...");
            data.setId(id);
            profileService.syncProfile(data);
            updated = profileService.updateProfile(id, data);
        }
        
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @PostMapping("/sync")
    @Operation(summary = "Sincronizar perfil", description = "Sincroniza datos desde Auth")
    public ResponseEntity<User> sync(@RequestBody User data) {
        return ResponseEntity.ok(profileService.syncProfile(data));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener perfil", description = "Obtiene los datos de un usuario por ID")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        List<User> all = profileService.listAll();
        return all.stream()
                  .filter(u -> u.getId().equals(id))
                  .findFirst()
                  .map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/list")
    public ResponseEntity<List<User>> listAll() {
        return ResponseEntity.ok(profileService.listAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        profileService.delete(id);
        return ResponseEntity.noContent().build();
    }
}