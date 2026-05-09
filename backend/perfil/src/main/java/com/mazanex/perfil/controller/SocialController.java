package com.mazanex.perfil.controller;

import com.mazanex.perfil.model.Seguidor;
import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.model.Notificacion;
import com.mazanex.perfil.model.SolicitudAmistad;
import com.mazanex.perfil.repository.SeguidorRepository;
import com.mazanex.perfil.repository.UsuarioRepository;
import com.mazanex.perfil.repository.NotificacionRepository;
import com.mazanex.perfil.repository.SolicitudAmistadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

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

    @Autowired
    private SolicitudAmistadRepository solicitudRepository;

    @PostMapping("/enviar-solicitud/{solicitanteId}/{receptorId}")
    public ResponseEntity<?> enviarSolicitud(@PathVariable Long solicitanteId, @PathVariable Long receptorId) {
        if (solicitanteId.equals(receptorId)) return ResponseEntity.badRequest().body("No puedes agregarte a ti mismo");

        Usuario solicitante = usuarioRepository.findById(solicitanteId).orElse(null);
        Usuario receptor = usuarioRepository.findById(receptorId).orElse(null);

        if (solicitante == null || receptor == null) return ResponseEntity.notFound().build();

        boolean yaExiste = solicitudRepository.existsBySolicitanteAndReceptor(solicitante, receptor) || 
                          solicitudRepository.existsBySolicitanteAndReceptor(receptor, solicitante);
        
        if (yaExiste) return ResponseEntity.badRequest().body("{\"error\": \"Ya existe una solicitud o amistad\"}");

        solicitudRepository.save(new SolicitudAmistad(solicitante, receptor, "PENDIENTE"));
        
        String mensaje = solicitante.getNombre() + " te ha enviado una solicitud de amistad.";
        // Este ya estaba bien (4 argumentos)
        notificacionRepository.save(new Notificacion(receptor, "FRIEND_REQUEST", mensaje, solicitanteId));

        return ResponseEntity.ok("{\"status\": \"PENDIENTE\"}");
    }

    @PostMapping("/aceptar-solicitud/{solicitanteId}/{receptorId}")
    public ResponseEntity<?> aceptarSolicitud(@PathVariable Long solicitanteId, @PathVariable Long receptorId) {
        Usuario solicitante = usuarioRepository.findById(solicitanteId).orElse(null);
        Usuario receptor = usuarioRepository.findById(receptorId).orElse(null);

        return solicitudRepository.findBySolicitanteAndReceptor(solicitante, receptor)
                .map(sol -> {
                    sol.setEstado("ACEPTADA");
                    solicitudRepository.save(sol);

                    seguidorRepository.save(new Seguidor(solicitante, receptor));
                    seguidorRepository.save(new Seguidor(receptor, solicitante));

                    // FIX APLICADO: Ahora pasamos el receptorId como 4to argumento
                    String mensaje = receptor.getNombre() + " aceptó tu solicitud de amistad.";
                    notificacionRepository.save(new Notificacion(solicitante, "FRIEND_ACCEPT", mensaje, receptorId));

                    return ResponseEntity.ok("{\"status\": \"ACEPTADA\"}");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado-relacion/{idA}/{idB}")
    public ResponseEntity<?> obtenerEstadoRelacion(@PathVariable Long idA, @PathVariable Long idB) {
        Usuario a = usuarioRepository.findById(idA).orElse(null);
        Usuario b = usuarioRepository.findById(idB).orElse(null);
        
        if (a == null || b == null) return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        var sol1 = solicitudRepository.findBySolicitanteAndReceptor(a, b);
        if (sol1.isPresent()) {
            response.put("estado", sol1.get().getEstado());
            response.put("soySolicitante", true);
            return ResponseEntity.ok(response);
        }

        var sol2 = solicitudRepository.findBySolicitanteAndReceptor(b, a);
        if (sol2.isPresent()) {
            response.put("estado", sol2.get().getEstado());
            response.put("soySolicitante", false);
            return ResponseEntity.ok(response);
        }

        response.put("estado", "NADA");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/siguiendo/{id}")
    public ResponseEntity<?> obtenerSiguiendo(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(u -> {
                    List<Long> idsSeguidos = seguidorRepository.findBySeguidor(u)
                            .stream().map(s -> s.getSeguido().getId()).toList();
                    return ResponseEntity.ok(idsSeguidos);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/publico/{id}")
    public ResponseEntity<?> obtenerPerfilPublico(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(u -> {
                    Map<String, Object> p = new HashMap<>();
                    p.put("id", u.getId());
                    p.put("nombre", u.getNombre());
                    p.put("biografia", u.getBiografia());
                    p.put("avatarUrl", u.getAvatarUrl());
                    p.put("bannerUrl", u.getBannerUrl());
                    p.put("fondoUrl", u.getFondoUrl());
                    return ResponseEntity.ok(p);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/notificaciones/{usuarioId}")
    public ResponseEntity<List<Notificacion>> obtenerNotificaciones(@PathVariable Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .map(u -> ResponseEntity.ok(notificacionRepository.findByUsuarioDestinoOrderByFechaDesc(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/notificaciones/{usuarioId}/leer")
    public ResponseEntity<?> marcarNotificacionesComoLeidas(@PathVariable Long usuarioId) {
        return usuarioRepository.findById(usuarioId).map(u -> {
            List<Notificacion> notificaciones = notificacionRepository.findByUsuarioDestinoOrderByFechaDesc(u);
            for (Notificacion n : notificaciones) {
                if (!n.isLeida()) {
                    n.setLeida(true);
                    notificacionRepository.save(n);
                }
            }
            return ResponseEntity.ok("Notificaciones marcadas como leídas");
        }).orElse(ResponseEntity.notFound().build());
    }
}
