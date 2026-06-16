package com.mazanex.publications.service;

import com.mazanex.publications.dto.CommentDto;
import com.mazanex.publications.dto.PublicationDto;
import com.mazanex.publications.model.Comment;
import com.mazanex.publications.model.Publication;
import com.mazanex.publications.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PublicationService {

    @Autowired
    private PublicationRepository publicationRepository;

    public List<Publication> getFeed() {
        return publicationRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Publication> getUserPublications(Long authorId) {
        return publicationRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
    }

    public Publication createPublication(PublicationDto dto) {
        // CORREGIDO: En records no hay setters. Instanciamos todo directamente desde el constructor.
        // Los valores pasados como 'null' al final serán manejados por el constructor compacto del record.
        Publication pub = new Publication(
            null, // id autogenerado por BD
            dto.getAuthorId(),
            dto.getAuthorName(),
            dto.getAuthorAvatarUrl(),
            dto.getContent(),
            dto.getMediaUrl(),
            null, // likedBy (el record creará el HashSet vacío)
            null, // comments (el record creará el ArrayList vacío)
            null  // createdAt (el record asignará LocalDateTime.now())
        );
        return publicationRepository.save(pub);
    }

    public Map<String, Object> toggleLike(Long publicationId, Long userId) {
        Publication pub = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));

        boolean isLiked = pub.toggleLike(userId); // Tu método personalizado del record sigue funcionando
        publicationRepository.save(pub);

        Map<String, Object> response = new HashMap<>();
        response.put("liked", isLiked);
        response.put("totalLikes", pub.getLikeCount()); // Tu método personalizado
        return response;
    }

    public Publication addComment(Long publicationId, CommentDto dto) {
        Publication pub = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));

        // CORREGIDO: Creamos el comentario pasando los datos directamente al constructor del record
        Comment comment = new Comment(
            null, // id autogenerado por BD
            publicationId,
            dto.getAuthorId(),
            dto.getAuthorName(),
            dto.getAuthorAvatarUrl(),
            dto.getContent(),
            null  // createdAt (el record asignará LocalDateTime.now())
        );

        // CORREGIDO: Cambiamos .getComments() por .comments()
        pub.comments().add(comment); 
        return publicationRepository.save(pub); 
    }
    
    public void deletePublication(Long publicationId, Long userId) {
        Publication pub = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));
        
        // CORREGIDO: Cambiamos .getAuthorId() por .authorId()
        if (!pub.authorId().equals(userId)) {
            throw new IllegalStateException("No tienes permiso para borrar esto");
        }
        publicationRepository.delete(pub);
    }
}