package com.mazanex.publications.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public record Publication(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,

    @Column(nullable = false)
    Long authorId,

    @Column(nullable = false)
    String authorName,

    String authorAvatarUrl,

    @Column(length = 2000)
    String content,

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    String mediaUrl,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "publication_likes", joinColumns = @JoinColumn(name = "publication_id"))
    @Column(name = "user_id")
    Set<Long> likedBy,

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "publication_id")
    List<Comment> comments,

    LocalDateTime createdAt
) {
    // Constructor compacto para emular los valores por defecto y el @PrePersist
    public Publication {
        if (likedBy == null) likedBy = new HashSet<>();
        if (comments == null) comments = new ArrayList<>();
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    // Métodos utilitarios de tu clase original
    public boolean toggleLike(Long userId) {
        if (this.likedBy.contains(userId)) {
            this.likedBy.remove(userId);
            return false; 
        } else {
            this.likedBy.add(userId);
            return true;  
        }
    }

    public int getLikeCount() {
        return this.likedBy.size();
    }
}