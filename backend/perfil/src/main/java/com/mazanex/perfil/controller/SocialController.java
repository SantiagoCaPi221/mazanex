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

    // --- SOLICITUDES DE AMISTAD ---

    @PostMapping("/enviar-solicitud/{solicitanteId}/{receptorId}")
    public ResponseEntity<?> enviarSolicitud(@PathVariable Long solicitanteId, @PathVariable Long receptorId) {
        if (solicitanteId.equals(receptorId)) return ResponseEntity.badRequest().body("No puedes agregarte a ti mismo");

        Usuario solicitante = usuarioRepository.findById(solicitanteId).orElse(null);
        Usuario receptor = usuarioRepository.findById(receptorId).orElse(null);

        if (solicitante == null || receptor == null) return ResponseEntity.notFound().build();

        // Verificar si ya existe alguna solicitud en cualquier dirección
        boolean yaExiste = solicitudRepository.existsBySolicitanteAndReceptor(solicitante, receptor) || 
                          solicitudRepository.existsBySolicitanteAndReceptor(receptor, solicitante);
        
        if (yaExiste) return ResponseEntity.badRequest().body("{\"error\": \"Ya existe una solicitud o amistad\"}");

        // Guardar solicitud pendiente
        SolicitudAmistad nuevaSolicitud = new SolicitudAmistad(solicitante, receptor, "PENDIENTE");
        solicitudRepository.save(nuevaSolicitud);

        // Notificar al receptor
        String mensaje = solicitante.getNombre() + " te ha enviado una solicitud de amistad.";
        notificacionRepository.save(new Notificacion(receptor, "FRIEND_REQUEST", mensaje));

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

                    // Para mantener compatibilidad con el sistema de seguidores:
                    // Se siguen mutuamente de forma automática
                    seguidorRepository.save(new Seguidor(solicitante, receptor));
                    seguidorRepository.save(new Seguidor(receptor, solicitante));

                    // Notificar al solicitante que fue aceptado
                    String mensaje = receptor.getNombre() + " aceptó tu solicitud de amistad.";
                    notificacionRepository.save(new Notificacion(solicitante, "FRIEND_ACCEPT", mensaje));

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
        
        // Buscamos si A le pidió a B
        var sol1 = solicitudRepository.findBySolicitanteAndReceptor(a, b);
        if (sol1.isPresent()) {
            response.put("estado", sol1.get().getEstado());
            response.put("soySolicitante", true);
            return ResponseEntity.ok(response);
        }

        // Buscamos si B le pidió a A
        var sol2 = solicitudRepository.findBySolicitanteAndReceptor(b, a);
        if (sol2.isPresent()) {
            response.put("estado", sol2.get().getEstado());
            response.put("soySolicitante", false);
            return ResponseEntity.ok(response);
        }

        response.put("estado", "NADA");
        return ResponseEntity.ok(response);
    }

    // --- SEGUIDORES Y PERFIL ---

    @GetMapping("/siguiendo/{id}")
    public ResponseEntity<?> obtenerSiguiendo(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(u -> {
                    List<Long> idsSeguidos = seguidorRepository.findBySeguidor(u)
                            .stream()
                            .map(s -> s.getSeguido().getId())
                            .toList();
                    return ResponseEntity.ok(idsSeguidos);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/publico/{id}")
    public ResponseEntity<?> obtenerPerfilPublico(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(u -> {
                    Map<String, Object> publico = new HashMap<>();
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
