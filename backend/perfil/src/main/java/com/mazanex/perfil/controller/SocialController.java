package com.mazanex.perfil.controller;

import com.mazanex.perfil.model.Seguidor;
import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.repository.SeguidorRepository;
import com.mazanex.perfil.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social")
@CrossOrigin(origins = "*")
public class SocialController {

    @Autowired
    private SeguidorRepository seguidorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/seguir/{seguidorId}/{seguidoId}")
    public ResponseEntity<?> seguirUsuario(@PathVariable Long seguidorId, @PathVariable Long seguidoId) {
        if (seguidorId.equals(seguidoId)) return ResponseEntity.badRequest().body("No puedes seguirte a ti mismo");

        Usuario seguidor = usuarioRepository.findById(seguidorId).orElse(null);
        Usuario seguido = usuarioRepository.findById(seguidoId).orElse(null);

        if (seguidor == null || seguido == null) return ResponseEntity.notFound().build();

        // Si ya lo sigue, lo deja de seguir (Toggle)
        return seguidorRepository.findBySeguidorAndSeguido(seguidor, seguido)
                .map(relacion -> {
                    seguidorRepository.delete(relacion);
                    return ResponseEntity.ok("Dejado de seguir");
                })
                .orElseGet(() -> {
                    seguidorRepository.save(new Seguidor(seguidor, seguido));
                    return ResponseEntity.ok("Siguiendo");
                });
    }

    @GetMapping("/siguiendo/{id}")
    public ResponseEntity<List<Seguidor>> obtenerSiguiendo(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(u -> ResponseEntity.ok(seguidorRepository.findBySeguidor(u)))
                .orElse(ResponseEntity.notFound().build());
    }
}
