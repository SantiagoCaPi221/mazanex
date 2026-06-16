package com.mazanex.profile.model;

import jakarta.persistence.*;

public record User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,
    
    String name,
    String email,

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    String avatarUrl,

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    String bannerUrl,

    @Column(name = "bio")
    String bio,

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    String backgroundUrl
) {
    // Constructor de 6 argumentos para mantener la compatibilidad con tu código actual (deja el id como null)
    public User(String name, String email, String avatarUrl, String bannerUrl, String bio, String backgroundUrl) {
        this(null, name, email, avatarUrl, bannerUrl, bio, backgroundUrl);
    }
}