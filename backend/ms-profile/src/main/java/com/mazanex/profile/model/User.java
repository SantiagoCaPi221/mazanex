package com.mazanex.profile.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter 
@Setter
@NoArgsConstructor
public class User {
    @Id
    private Long id;
    
    private String name;
    private String email;

    // Se remueve @Lob para evitar errores de conversión en Hibernate 6
    @Column(columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Column(columnDefinition = "LONGTEXT")
    private String bannerUrl;

    @Column(name = "bio")
    private String bio;

    @Column(columnDefinition = "LONGTEXT")
    private String backgroundUrl;

    public User(String name, String email, String avatarUrl, String bannerUrl, String bio, String backgroundUrl) {
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.bannerUrl = bannerUrl;
        this.bio = bio;
        this.backgroundUrl = backgroundUrl;
    }
}