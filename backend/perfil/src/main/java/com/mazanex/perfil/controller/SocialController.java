package com.mazanex.perfil.controller;

import com.mazanex.perfil.model.Seguidor;
import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.model.Notificacion;
import com.mazanex.perfil.repository.SeguidorRepository;
import com.mazanex.perfil.repository.UsuarioRepository;
import com.mazanex.perfil.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfil/social")
@CrossOrigin(origins = "*")
public class SocialController {

    @Autowired
    private SeguidorRepository seguidorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private NotificacionRepository notificacionRepository; 

    @PostMapping("/seguir/{seguidorId}/{seguidoId}")
    public ResponseEntity<?> seguirUsuario(@PathVariable Long seguidorId, @PathVariable Long seguidoId) {
        if (seguidorId.equals(seguidoId)) return ResponseEntity.badRequest().body("No puedes seguirte a ti mismo");

        Usuario seguidor = usuarioRepository.findById(seguidorId).orElse(null);
        Usuario seguido = usuarioRepository.findById(seguidoId).orElse(null);

        if (seguidor == null || seguido == null) return ResponseEntity.notFound().build();

        return seguidorRepository.findBySeguidorAndSeguido(seguidor, seguido)
                .map(relacion -> {
                    seguidorRepository.delete(relacion);
                    return ResponseEntity.ok("Dejado de seguir");
                })
                .orElseGet(() -> {
                    // 1. Guarda la relación de seguidor
                    seguidorRepository.save(new Seguidor(seguidor, seguido));
                    
                    // 2. CREA LA NOTIFICACIÓN REAL
                    String mensaje = seguidor.getNombre() + " ha comenzado a seguirte.";
                    notificacionRepository.save(new Notificacion(seguido, "FOLLOW", mensaje));
                    
                    return ResponseEntity.ok("Siguiendo");
                });
    }

    @GetMapping("/siguiendo/{id}")
    public ResponseEntity<List<Seguidor>> obtenerSiguiendo(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(u -> ResponseEntity.ok(seguidorRepository.findBySeguidor(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    // NUEVO ENDPOINT: Para que Next.js pida las notificaciones
    @GetMapping("/notificaciones/{usuarioId}")
    public ResponseEntity<List<Notificacion>> obtenerNotificaciones(@PathVariable Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .map(u -> ResponseEntity.ok(notificacionRepository.findByUsuarioDestinoOrderByFechaDesc(u)))
                .orElse(ResponseEntity.notFound().build());
    }
}
