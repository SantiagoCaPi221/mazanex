package com.mazanex.auth.model;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;
    private String email;
    private String password;
    private String rol;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String bannerUrl;

    @Column(name = "biografia")
    private String biografia;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String fondoUrl;

    public Usuario() {}

    public Usuario(Long id, String nombre, String email, String password, String rol, String avatarUrl, String bannerUrl, String biografia, String fondoUrl) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.avatarUrl = avatarUrl;
        this.bannerUrl = bannerUrl;
        this.biografia = biografia;
        this.fondoUrl = fondoUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getBiografia() { return biografia; }
    public void setBiografia(String biografia) { this.biografia = biografia; }

    public String getFondoUrl() { return fondoUrl; }
    public void setFondoUrl(String fondoUrl) { this.fondoUrl = fondoUrl; }
}
