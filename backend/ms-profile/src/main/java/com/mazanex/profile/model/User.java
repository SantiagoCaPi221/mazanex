package com.mazanex.profile.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    
    private String name;
    private String email;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String bannerUrl;

    @Column(name = "bio")
    private String bio;

    @Lob
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