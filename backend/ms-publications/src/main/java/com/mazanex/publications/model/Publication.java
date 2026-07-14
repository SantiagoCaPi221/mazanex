package com.mazanex.publications.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Entidad que representa una publicación del feed comunitario.
 * Incluye contenido, media, likes y comentarios asociados.
 */
@Entity
@Table(name = "publications")
@Data
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long authorId;

    @Column(nullable = false)
    private String authorName;

    private String authorAvatarUrl;

    @Column(length = 2000)
    private String content;

    // LONGTEXT para soportar imágenes en Base64 o URLs largas de video
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String mediaUrl; 

    // Magia de JPA: Un Set nativo solo con los IDs de los usuarios que dieron Like
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "publication_likes", joinColumns = @JoinColumn(name = "publication_id"))
    @Column(name = "user_id")
    private Set<Long> likedBy = new HashSet<>();

    // Relación One-to-Many con los comentarios
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "publication_id")
    private List<Comment> comments = new ArrayList<>();

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { this.createdAt = LocalDateTime.now(); }

    // Métodos utilitarios para los Likes
    public boolean toggleLike(Long userId) {
        if (this.likedBy.contains(userId)) {
            this.likedBy.remove(userId);
            return false; // Significa que quitó el like
        } else {
            this.likedBy.add(userId);
            return true;  // Significa que dio like
        }
    }

    public int getLikeCount() {
        return this.likedBy.size();
    }
}