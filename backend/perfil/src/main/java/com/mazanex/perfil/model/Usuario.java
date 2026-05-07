package com.mazanex.perfil.model;

import jakarta.persistence.*;

@Entity
@Table(name = "perfiles_usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String email;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String avatarUrl;

    public Usuario() {}

    public Usuario(String nombre, String email, String avatarUrl) {
        this.nombre = nombre;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
