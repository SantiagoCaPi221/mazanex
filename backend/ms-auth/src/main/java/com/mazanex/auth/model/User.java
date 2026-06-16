package com.mazanex.auth.model;

import jakarta.persistence.*;

public record User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id,
    
    String name,
    String email,
    String password,
    String role,

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
) {}