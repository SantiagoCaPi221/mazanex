package com.mazanex.perfil.repository;

import com.mazanex.perfil.model.Puntaje;
import com.mazanex.perfil.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PuntajeRepository extends JpaRepository<Puntaje, Long> {
    
    // Muestra todos los puntajes en el perfil del usuario (Muro de Evidencias)
    List<Puntaje> findByUsuario(Usuario usuario);

    // Busca el récord exacto de un usuario en un juego Y en una categoría específica
    Optional<Puntaje> findByUsuarioAndJuegoAndModo(Usuario usuario, String juego, String modo);
    
    // Para el ranking de la comunidad general (mezclando todos los modos de un juego)
    List<Puntaje> findByJuegoOrderByPuntajeMaximoDesc(String juego);

    // NUEVO (Opcional para el futuro): Para sacar el Top 10 de un juego en una dificultad específica
    List<Puntaje> findByJuegoAndModoOrderByPuntajeMaximoDesc(String juego, String modo);
}
