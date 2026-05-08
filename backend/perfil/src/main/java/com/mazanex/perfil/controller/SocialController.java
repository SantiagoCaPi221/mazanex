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
                    return ResponseEntity.ok().body("{\"status\": \"unfollowed\"}");
                })
                .orElseGet(() -> {
                    seguidorRepository.save(new Seguidor(seguidor, seguido));
                    String mensaje = seguidor.getNombre() + " ha comenzado a seguirte.";
                    notificacionRepository.save(new Notificacion(seguido, "FOLLOW", mensaje));
                    return ResponseEntity.ok().body("{\"status\": \"followed\"}");
                });
    }

   @GetMapping("/siguiendo/{id}")
    public ResponseEntity<?> obtenerSiguiendo(@PathVariable Long id) {
    return usuarioRepository.findById(id)
            .map(u -> {
                List<java.util.Map<String, Object>> lista = seguidorRepository.findBySeguidor(u)
                    .stream().map(s -> {
                        java.util.Map<String, Object> map = new java.util.HashMap<>();
                        map.put("id", s.getSeguido().getId());
                        map.put("nombre", s.getSeguido().getNombre());
                        map.put("avatarUrl", s.getSeguido().getAvatarUrl());
                        return map;
                    }).toList();
                return ResponseEntity.ok(lista);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // NUEVO ENDPOINT: Para que Next.js pida las notificaciones
    @GetMapping("/notificaciones/{usuarioId}")
    public ResponseEntity<List<Notificacion>> obtenerNotificaciones(@PathVariable Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .map(u -> ResponseEntity.ok(notificacionRepository.findByUsuarioDestinoOrderByFechaDesc(u)))
                .orElse(ResponseEntity.notFound().build());
    }
    // Marcar todas las notificaciones de un usuario como leídas
    @PutMapping("/notificaciones/{usuarioId}/leer")
    public ResponseEntity<?> marcarNotificacionesComoLeidas(@PathVariable Long usuarioId) {
        return usuarioRepository.findById(usuarioId).map(u -> {
            List<Notificacion> notificaciones = notificacionRepository.findByUsuarioDestinoOrderByFechaDesc(u);
            for (Notificacion n : notificaciones) {
                if (!n.isLeida()) {
                    n.setLeida(true);
                    notificacionRepository.save(n); // Guarda el cambio en la BD
                }
            }
            return ResponseEntity.ok("Notificaciones marcadas como leídas");
        }).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/publico/{id}")
    public ResponseEntity<?> obtenerPerfilPublico(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(u -> {
                    java.util.Map<String, Object> publico = new java.util.HashMap<>();
                    publico.put("id", u.getId());
                    publico.put("nombre", u.getNombre());
                    publico.put("biografia", u.getBiografia());
                    publico.put("avatarUrl", u.getAvatarUrl());
                    publico.put("bannerUrl", u.getBannerUrl());
                    publico.put("fondoUrl", u.getFondoUrl());
                    return ResponseEntity.ok(publico);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/estado-amistad/{usuarioA}/{usuarioB}")
    public ResponseEntity<Boolean> esSeguimientoMutuo(@PathVariable Long usuarioA, @PathVariable Long usuarioB) {
    Usuario a = usuarioRepository.findById(usuarioA).orElse(null);
    Usuario b = usuarioRepository.findById(usuarioB).orElse(null);
    
    if (a == null || b == null) return ResponseEntity.ok(false);

    // Verificamos si A sigue a B Y si B sigue a A
    boolean aSigueB = seguidorRepository.findBySeguidorAndSeguido(a, b).isPresent();
    boolean bSigueA = seguidorRepository.findBySeguidorAndSeguido(b, a).isPresent();

    return ResponseEntity.ok(aSigueB && bSigueA);
}
}
