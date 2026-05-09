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
}
