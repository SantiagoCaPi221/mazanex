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

/**
 * Controlador REST para la gestión de perfiles de usuario.
 * Expone operaciones de creación, actualización, consulta y eliminación de perfiles.
 */
@RestController
@RequestMapping("/api/profile")
@Tag(name = "1. Gestión de Perfiles", description = "Endpoints para la administración de datos de usuario")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /**
     * Actualiza un perfil existente o crea uno nuevo si no existe.
     *
     * @param id identificador del perfil
     * @param data datos del perfil a persistir
     * @return perfil actualizado o creado
     */
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

    /**
     * Sincroniza un perfil con los datos recibidos desde otros microservicios.
     *
     * @param data datos de perfil a sincronizar
     * @return perfil sincronizado
     */
    @PostMapping("/sync")
    @Operation(summary = "Sincronizar perfil", description = "Sincroniza datos desde Auth")
    public ResponseEntity<User> sync(@RequestBody User data) {
        return ResponseEntity.ok(profileService.syncProfile(data));
    }

    /**
     * Obtiene un perfil por su identificador.
     *
     * @param id identificador del perfil
     * @return respuesta HTTP con el perfil si existe
     */
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

    /**
     * Devuelve la lista completa de perfiles registrados.
     *
     * @return listado de perfiles
     */
    @GetMapping("/list")
    public ResponseEntity<List<User>> listAll() {
        return ResponseEntity.ok(profileService.listAll());
    }

    /**
     * Elimina un perfil por identificador.
     *
     * @param id identificador del perfil a eliminar
     * @return respuesta vacía si la operación finaliza correctamente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        profileService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/test-list")
    public ResponseEntity<?> testList() {
    return ResponseEntity.ok(profileService.listAll());
}
}