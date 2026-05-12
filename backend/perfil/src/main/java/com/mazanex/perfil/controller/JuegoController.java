package com.mazanex.perfil.controller;

import com.mazanex.perfil.model.Puntaje;
import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.repository.PuntajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional; 

@RestController
@RequestMapping("/api/perfil/juegos") 
public class JuegoController {

    @Autowired
    private PuntajeRepository puntajeRepository;

    // --- MÉTODOS DE LECTURA (NUEVOS) ---

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Puntaje>> obtenerPorUsuario(@PathVariable Long id) {
        Usuario u = new Usuario();
        u.setId(id);
        return ResponseEntity.ok(puntajeRepository.findByUsuario(u));
    }

    @GetMapping("/ranking/{juego}")
    public ResponseEntity<List<Puntaje>> obtenerRanking(@PathVariable String juego) {
        // Retorna los mejores puntajes de un juego para la comunidad
        return ResponseEntity.ok(puntajeRepository.findByJuegoOrderByPuntajeMaximoDesc(juego));
    }

    // --- MÉTODOS DE ESCRITURA (ACTUALIZADOS) ---

    @PostMapping("/guardar-record")
    public ResponseEntity<?> guardarRecord(@RequestBody PuntajeRequest req) {
        Usuario usuarioRef = new Usuario();
        usuarioRef.setId(req.getUsuarioId());

        Optional<Puntaje> existente = puntajeRepository.findByUsuarioAndJuegoAndModo(
            usuarioRef, req.getJuego(), req.getModo()
        );

        if (existente.isPresent()) {
            Puntaje p = existente.get();
            if (req.getPuntajeMaximo() > p.getPuntajeMaximo()) {
                p.setPuntajeMaximo(req.getPuntajeMaximo());
                p.setScreenshotUrl(req.getScreenshotUrl());
                p.setReportes(0);
                return ResponseEntity.ok(puntajeRepository.save(p));
            }
            return ResponseEntity.ok("{\"status\": \"NO_RECORD\"}");
        }

        Puntaje nuevo = new Puntaje(
            usuarioRef, req.getJuego(), req.getModo(), 
            req.getPuntajeMaximo(), req.getScreenshotUrl()
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

    public static class PuntajeRequest {
        private Long usuarioId; 
        private String juego;
        private String modo;
        private Integer puntajeMaximo;
        private String screenshotUrl;

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
