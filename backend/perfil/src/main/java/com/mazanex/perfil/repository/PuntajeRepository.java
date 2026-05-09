package com.mazanex.perfil.repository;

import com.mazanex.perfil.model.Puntaje;
import com.mazanex.perfil.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PuntajeRepository extends JpaRepository<Puntaje, Long> {
    
    // NUEVO: Fundamental para mostrar todos los juegos en el perfil del usuario
    List<Puntaje> findByUsuario(Usuario usuario);

    // Para buscar si un usuario ya tiene un récord en un juego específico (para actualizarlo)
    Optional<Puntaje> findByUsuarioAndJuego(Usuario usuario, String juego);
    
    // Para el ranking de la comunidad: mejores puntajes de un juego
    List<Puntaje> findByJuegoOrderByPuntajeMaximoDesc(String juego);
}
