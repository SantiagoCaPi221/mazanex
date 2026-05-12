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

        /**
         * CAMBIO CLAVE: Ahora buscamos por Usuario, Juego Y Modo.
         * Esto permite tener récords separados para "MINI - ELITE" y "GRANDE - SLOW".
         */
        Optional<Puntaje> existente = puntajeRepository.findByUsuarioAndJuegoAndModo(
            usuarioRef, 
            req.getJuego(), 
            req.getModo()
        );

        if (existente.isPresent()) {
            Puntaje p = existente.get();
            // Solo actualizamos si el nuevo puntaje es superior al récord anterior en este modo
            if (req.getPuntajeMaximo() > p.getPuntajeMaximo()) {
                p.setPuntajeMaximo(req.getPuntajeMaximo());
                p.setScreenshotUrl(req.getScreenshotUrl());
                p.setReportes(0); // Limpiamos reportes al actualizar evidencia
                return ResponseEntity.ok(puntajeRepository.save(p));
            }
            return ResponseEntity.badRequest().body("{\"error\": \"El puntaje no supera al récord actual en este modo.\"}");
        }

        // Si no existe, creamos el nuevo récord incluyendo el modo
        Puntaje nuevo = new Puntaje(
            usuarioRef, 
            req.getJuego(), 
            req.getModo(), 
            req.getPuntajeMaximo(), 
            req.getScreenshotUrl()
        );
        
        return ResponseEntity.ok(puntajeRepository.save(nuevo));
    }

    @PostMapping("/reportar/{id}")
    public ResponseEntity<?> reportar(@PathVariable Long id) {
        return puntajeRepository.findById(id).map(p -> {
            p.setReportes(p.getReportes() + 1);
            
            if (p.getReportes() >= 3) {
                puntajeRepository.delete(p);
                return ResponseEntity.ok("{\"status\": \"DELETED\"}");
            }
            
            puntajeRepository.save(p);
            return ResponseEntity.ok("{\"status\": \"REPORTED\", \"count\": " + p.getReportes() + "}");
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * DTO actualizado para recibir el modo desde el frontend.
     */
    public static class PuntajeRequest {
        private Long usuarioId; 
        private String juego;
        private String modo; // NUEVO
        private Integer puntajeMaximo;
        private String screenshotUrl;

        // Getters y Setters
        public Long getUsuarioId() { return usuarioId; }
        public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

        public String getJuego() { return juego; }
        public void setJuego(String juego) { this.juego = juego; }

        public String getModo() { return modo; }
        public void setModo(String modo) { this.modo = modo; }

        public Integer getPuntajeMaximo() { return puntajeMaximo; }
        public void setPuntajeMaximo(Integer puntajeMaximo) { this.puntajeMaximo = puntajeMaximo; }

        public String getScreenshotUrl() { return screenshotUrl; }
        public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }
    }
}
