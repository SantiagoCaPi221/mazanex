package com.mazanex.perfil.repository;

import com.mazanex.perfil.model.SolicitudAmistad;
import com.mazanex.perfil.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SolicitudAmistadRepository extends JpaRepository<SolicitudAmistad, Long> {
    
    // Para verificar si ya existe una solicitud antes de enviar otra
    boolean existsBySolicitanteAndReceptor(Usuario solicitante, Usuario receptor);

    // Para buscar la solicitud específica al momento de aceptar o rechazar
    Optional<SolicitudAmistad> findBySolicitanteAndReceptor(Usuario solicitante, Usuario receptor);
}
