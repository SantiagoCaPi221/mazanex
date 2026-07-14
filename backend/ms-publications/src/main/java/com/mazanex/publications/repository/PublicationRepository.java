package com.mazanex.publications.repository;

import com.mazanex.publications.model.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para consultar publicaciones del feed y del perfil de usuario.
 */
@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    // Esto es para el Feed de Instagram: trae todo ordenado de más nuevo a más viejo
    List<Publication> findAllByOrderByCreatedAtDesc();
    
    // Esto es para el perfil del usuario: trae solo sus posts
    List<Publication> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}