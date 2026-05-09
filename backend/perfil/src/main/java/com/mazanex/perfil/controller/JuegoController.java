package com.mazanex.perfil.controller;

import com.mazanex.perfil.model.Puntaje;
import com.mazanex.perfil.model.Usuario;
import com.mazanex.perfil.repository.PuntajeRepository;
import com.mazanex.perfil.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfil/juegos")
@CrossOrigin(origins = "*")
public class JuegoController {

    @Autowired
    private PuntajeRepository puntajeRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/record/{usuarioId}/{juego}")
    public ResponseEntity<Puntaje> guardarRecord(@PathVariable Long usuarioId, @PathVariable String juego, @RequestBody Integer nuevoPuntaje) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();

        Puntaje record = puntajeRepository.findByUsuarioAndJuego(usuario, juego)
                .orElse(new Puntaje(usuario, juego, 0));

        if (nuevoPuntaje > record.getPuntajeMaximo()) {
            record.setPuntajeMaximo(nuevoPuntaje);
            return ResponseEntity.ok(puntajeRepository.save(record));
        }

        return ResponseEntity.ok(record);
    }

    @GetMapping("/ranking/{juego}")
    public ResponseEntity<List<Puntaje>> obtenerRanking(@PathVariable String juego) {
        return ResponseEntity.ok(puntajeRepository.findByJuegoOrderByPuntajeMaximoDesc(juego));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Puntaje>> obtenerPuntajesPorUsuario(@PathVariable Long usuarioId) {
    Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
    if (usuario == null) return ResponseEntity.notFound().build();
    
    // Suponiendo que tienes un PuntajeRepository que busca por usuario
    return ResponseEntity.ok(puntajeRepository.findByUsuario(usuario));
    }

    @PostMapping("/guardar-record")
    public ResponseEntity<?> guardarRecord(@RequestBody PuntajeRequest req) {
        // Buscamos si ya tiene un récord en ese juego
        Optional<Puntaje> existente = puntajeRepository.findByUsuarioAndJuego(req.getUsuario(), req.getJuego());

        if (existente.isPresent()) {
            Puntaje p = existente.get();
            // Solo actualizamos si el nuevo puntaje es SUPERIOR
            if (req.getPuntajeMaximo() > p.getPuntajeMaximo()) {
                p.setPuntajeMaximo(req.getPuntajeMaximo());
                p.setScreenshotUrl(req.getScreenshotUrl());
                p.setReportes(0); // Se limpia el historial de reportes al subir nueva prueba
                return ResponseEntity.ok(puntajeRepository.save(p));
            }
            return ResponseEntity.badRequest().body("Puntaje inferior al actual.");
        }

        // Si es nuevo récord, creamos el objeto
        Puntaje nuevo = new Puntaje(req.getUsuario(), req.getJuego(), req.getPuntajeMaximo(), req.getScreenshotUrl());
        return ResponseEntity.ok(puntajeRepository.save(nuevo));
    }
    
    return ResponseEntity.ok(puntajeRepository.save(nuevoPuntaje));
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
}
