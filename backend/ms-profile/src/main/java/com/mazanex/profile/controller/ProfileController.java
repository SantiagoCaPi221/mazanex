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

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ProfileController.class);

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar perfil", description = "Modifica o crea el perfil si no existe.")
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User data) {
        
        // 1. Intentamos actualizar
        User updated = profileService.updateProfile(id, data);
        
        // 2. Si es null, es porque no existe. ¡Lo creamos en ese momento!
        if (updated == null) {
            System.out.println("DEBUG: Usuario con ID " + id + " no existe. Creando registro...");
            data.setId(id); // Forzamos el ID
            updated = profileService.syncProfile(data); // Esto lo guarda en la DB de perfiles
        }
        
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.internalServerError().build();
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

    @GetMapping("/test-list")
    public ResponseEntity<?> testList() {
    return ResponseEntity.ok(profileService.listAll());
    }

   @GetMapping("/test-glitchtip")
    public String test() {
        try {
            throw new RuntimeException("¡Gatillo manual desde el controlador! Probando comunicación activa.");
        } catch (Exception e) {
            // Este log.error ES EL QUE SENTRY CAPTURA OBLIGATORIAMENTE
            logger.error("Excepción manual capturada en el endpoint: ", e);
        }
        return "Petición procesada. Revisa GlitchTip.";
    }
}
