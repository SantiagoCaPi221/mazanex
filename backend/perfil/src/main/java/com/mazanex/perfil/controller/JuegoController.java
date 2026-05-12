package com.mazanex.perfil.controller;

import com.mazanex.perfil.model.Puntaje;
import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.repository.PuntajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; 

@RestController
@RequestMapping("/api/perfil/juegos") 
public class JuegoController {

    @Autowired
    private PuntajeRepository puntajeRepository;

    @PostMapping("/guardar-record")
    public ResponseEntity<?> guardarRecord(@RequestBody PuntajeRequest req) {
        
        // Creamos una referencia del usuario solo con el ID que manda el frontend
        Usuario usuarioRef = new Usuario();
        usuarioRef.setId(req.getUsuarioId());

        // Buscamos si el usuario ya tiene un récord en este juego específico
        Optional<Puntaje> existente = puntajeRepository.findByUsuarioAndJuego(usuarioRef, req.getJuego());

        if (existente.isPresent()) {
            Puntaje p = existente.get();
            // Solo actualizamos si el nuevo puntaje es superior al récord anterior
            if (req.getPuntajeMaximo() > p.getPuntajeMaximo()) {
                p.setPuntajeMaximo(req.getPuntajeMaximo());
                p.setScreenshotUrl(req.getScreenshotUrl());
                p.setReportes(0); // Limpiamos reportes al actualizar con nueva evidencia
                return ResponseEntity.ok(puntajeRepository.save(p));
            }
            return ResponseEntity.badRequest().body("{\"error\": \"El puntaje no supera al récord actual.\"}");
        }

        // Si no existe, creamos el nuevo récord usando la referencia del usuario
        Puntaje nuevo = new Puntaje(usuarioRef, req.getJuego(), req.getPuntajeMaximo(), req.getScreenshotUrl());
        return ResponseEntity.ok(puntajeRepository.save(nuevo));
    }

    @PostMapping("/reportar/{id}")
    public ResponseEntity<?> reportar(@PathVariable Long id) {
        return puntajeRepository.findById(id).map(p -> {
            p.setReportes(p.getReportes() + 1);
            
            // Lógica de auto-moderación: a los 3 reportes se elimina
            if (p.getReportes() >= 3) {
                puntajeRepository.delete(p);
                return ResponseEntity.ok("{\"status\": \"DELETED\"}");
            }
            
            puntajeRepository.save(p);
            return ResponseEntity.ok("{\"status\": \"REPORTED\", \"count\": " + p.getReportes() + "}");
        }).orElse(ResponseEntity.notFound().build());
    }

    public static class PuntajeRequest {
        private Long usuarioId; 
        private String juego;
        private Integer puntajeMaximo;
        private String screenshotUrl;

        // Getters y Setters
        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

        public String getJuego() { return juego; }
        public void setJuego(String juego) { this.juego = juego; }

        public Integer getPuntajeMaximo() { return puntajeMaximo; }
        public void setPuntajeMaximo(Integer puntajeMaximo) { this.puntajeMaximo = puntajeMaximo; }

        public String getScreenshotUrl() { return screenshotUrl; }
        public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }
    }
}
