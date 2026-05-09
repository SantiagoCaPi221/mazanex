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
    public ResponseEntity<?> guardarRecord(@RequestBody Puntaje nuevoPuntaje) {
    // Buscamos si ya existe un record para este usuario en este juego
    Optional<Puntaje> existente = puntajeRepository.findByUsuarioAndJuego(
        nuevoPuntaje.getUsuario(), nuevoPuntaje.getJuego()
    );

    if (existente.isPresent()) {
        Puntaje p = existente.get();
        // Solo actualizamos si el nuevo puntaje es mayor
        if (nuevoPuntaje.getPuntajeMaximo() > p.getPuntajeMaximo()) {
            p.setPuntajeMaximo(nuevoPuntaje.getPuntajeMaximo());
            p.setScreenshotUrl(nuevoPuntaje.getScreenshotUrl());
            p.setVerificado(false); // Resetear verificación al subir nuevo record
            p.setReportes(0);
            return ResponseEntity.ok(puntajeRepository.save(p));
        }
        return ResponseEntity.badRequest().body("El puntaje no supera tu record actual.");
    }
    
    return ResponseEntity.ok(puntajeRepository.save(nuevoPuntaje));
    }

    @PostMapping("/reportar/{id}")
    public ResponseEntity<?> reportarPuntaje(@PathVariable Long id) {
    return puntajeRepository.findById(id).map(p -> {
        // Incrementamos el contador
        p.setReportes(p.getReportes() + 1);
        
        // REGLA DE ORO: A los 3 reportes, fuera del sistema
        if (p.getReportes() >= 3) {
            puntajeRepository.delete(p);
            return ResponseEntity.ok("{\"status\": \"DELETED\", \"message\": \"El puntaje ha sido eliminado por la comunidad por ser considerado falso.\"}");
        }
        
        // Si tiene menos de 3, solo guardamos el nuevo conteo
        Puntaje actualizado = puntajeRepository.save(p);
        return ResponseEntity.ok(actualizado);
    }).orElse(ResponseEntity.notFound().build());
    }
}
