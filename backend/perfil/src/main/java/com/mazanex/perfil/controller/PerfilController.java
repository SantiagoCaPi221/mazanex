package com.mazanex.perfil.controller;

import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.repository.UsuarioRepository;
import com.mazanex.perfil.service.PerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "*")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @Autowired
    private UsuarioRepository perfilRepository;

    @PostMapping("/sync")
    public ResponseEntity<Usuario> sync(@RequestBody Usuario data) {
        return perfilRepository.findByEmail(data.getEmail())
            .map(usuarioExistente -> {
                usuarioExistente.setNombre(data.getNombre());
                // Se eliminó la línea del avatarUrl aquí
                return ResponseEntity.ok(perfilRepository.save(usuarioExistente));
            })
            .orElseGet(() -> {
                data.setId(null); 
                return ResponseEntity.status(HttpStatus.CREATED).body(perfilRepository.save(data));
            });
    }

    @GetMapping("/lista")
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(perfilService.listarPerfiles());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        perfilService.eliminarPerfil(id);
        return ResponseEntity.noContent().build();
    }
}
