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
        // Adaptado al acceso de métodos nativos de Record
        pub.setAuthorId(dto.authorId());
        pub.setAuthorName(dto.authorName());
        pub.setAuthorAvatarUrl(dto.authorAvatarUrl());
        pub.setContent(dto.content());
        pub.setMediaUrl(dto.mediaUrl());
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
        // Adaptado al acceso de métodos nativos de Record
        comment.setAuthorId(dto.authorId());
        comment.setAuthorName(dto.authorName());
        comment.setAuthorAvatarUrl(dto.authorAvatarUrl());
        comment.setContent(dto.content());

        pub.getComments().add(comment); 
        return publicationRepository.save(pub); 
    }
    
    public void deletePublication(Long publicationId, Long userId) {
        Publication pub = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new IllegalArgumentException("Publicación no encontrada"));
        
        if (!pub.getAuthorId().equals(userId)) {
            throw new IllegalStateException("No tienes permiso para borrar esto");
        }
        publicationRepository.delete(pub);
    }
}