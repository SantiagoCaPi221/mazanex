package com.mazanex.perfil.repository;

import com.mazanex.perfil.model.Seguidor;
import com.mazanex.perfil.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SeguidorRepository extends JpaRepository<Seguidor, Long> {
    // Para saber si ya sigo a alguien
    Optional<Seguidor> findBySeguidorAndSeguido(Usuario seguidor, Usuario seguido);
    
    // Para ver a quién sigo (Siguiendo)
    List<Seguidor> findBySeguidor(Usuario seguidor);
    
    // Para ver quién me sigue (Seguidores)
    List<Seguidor> findBySeguido(Usuario seguido);
}
