package com.mazanex.perfil.controller;

import com.mazanex.perfil.model.Puntaje;
import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.repository.PuntajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional; 

@RestController
@RequestMapping("/api/gateway/perfil/juegos")
public class JuegoController {

    @Autowired
    private PuntajeRepository puntajeRepository;

    @PostMapping("/guardar-record")
    public ResponseEntity<?> guardarRecord(@RequestBody PuntajeRequest req) {
        // Buscamos si el usuario ya tiene un récord en este juego específico
        Optional<Puntaje> existente = puntajeRepository.findByUsuarioAndJuego(req.getUsuario(), req.getJuego());

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

        // Si no existe, creamos el nuevo récord
        Puntaje nuevo = new Puntaje(req.getUsuario(), req.getJuego(), req.getPuntajeMaximo(), req.getScreenshotUrl());
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
        private Usuario usuario;
        private String juego;
        private Integer puntajeMaximo;
        private String screenshotUrl;

        // Getters y Setters necesarios para Jackson (JSON)
        public Usuario getUsuario() { return usuario; }
        public void setUsuario(Usuario usuario) { this.usuario = usuario; }

        public String getJuego() { return juego; }
        public void setJuego(String juego) { this.juego = juego; }

        public Integer getPuntajeMaximo() { return puntajeMaximo; }
        public void setPuntajeMaximo(Integer puntajeMaximo) { this.puntajeMaximo = puntajeMaximo; }

        public String getScreenshotUrl() { return screenshotUrl; }
        public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }
    }
}
