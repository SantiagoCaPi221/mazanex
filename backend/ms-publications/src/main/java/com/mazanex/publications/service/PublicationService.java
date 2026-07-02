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
        Publication pub = new Publication();
        pub.setAuthorId(dto.getAuthorId());
        pub.setAuthorName(dto.getAuthorName());
        pub.setAuthorAvatarUrl(dto.getAuthorAvatarUrl());
        pub.setContent(dto.getContent());
        pub.setMediaUrl(dto.getMediaUrl());
        return publicationRepository.save(pub);
    }

    public Map<String, Object> toggleLike(Long publicationId, Long userId) {
        Publication pub = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));

        boolean isLiked = pub.toggleLike(userId);
        publicationRepository.save(pub);

        Map<String, Object> response = new HashMap<>();
        response.put("liked", isLiked);
        response.put("totalLikes", pub.getLikeCount());
        return response;
    }

    public Publication addComment(Long publicationId, CommentDto dto) {
        Publication pub = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));

        Comment comment = new Comment();
        comment.setAuthorId(dto.getAuthorId());
        comment.setAuthorName(dto.getAuthorName());
        comment.setAuthorAvatarUrl(dto.getAuthorAvatarUrl());
        comment.setContent(dto.getContent());

        comment.setPublication(pub);

        pub.getComments().add(comment); // Lo agregamos a la lista
        return publicationRepository.save(pub); // JPA guarda el comentario automáticamente
    }
    
    public void deletePublication(Long publicationId, Long userId) {
        Publication pub = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));
        
        // Medida de seguridad: solo el autor puede borrar su post
        if (!pub.getAuthorId().equals(userId)) {
            throw new IllegalStateException("No tienes permiso para borrar esto");
        }
        publicationRepository.delete(pub);
    }
}