package com.mazanex.perfil.model;

import jakarta.persistence.*;

@Entity
@Table(name = "puntajes")
public class Puntaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el usuario que logró el puntaje
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Nombre del juego (ej: "SNAKE", "KOF", "SMASH")
    @Column(nullable = false)
    private String juego;

    // El puntaje más alto
    @Column(nullable = false)
    private Integer puntajeMaximo;

    public Puntaje() {}

    public Puntaje(Usuario usuario, String juego, Integer puntajeMaximo) {
        this.usuario = usuario;
        this.juego = juego;
        this.puntajeMaximo = puntajeMaximo;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getJuego() { return juego; }
    public void setJuego(String juego) { this.juego = juego; }
    
    public Integer getPuntajeMaximo() { return puntajeMaximo; }
    public void setPuntajeMaximo(Integer puntajeMaximo) { this.puntajeMaximo = puntajeMaximo; }
}
