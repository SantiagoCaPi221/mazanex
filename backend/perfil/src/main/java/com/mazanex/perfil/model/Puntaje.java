package com.mazanex.perfil.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "puntajes")
public class Puntaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el usuario que logró el puntaje
    @ManyToOne(fetch = FetchType.EAGER) // Cambiado a EAGER para ver el nombre del usuario en rankings fácilmente
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String juego;

    // MODO DEL JUEGO (Ej: "PRO - ELITE", "MEDIANO - NORMAL")
    @Column(name = "modo", nullable = true)
    private String modo;

    @Column(nullable = false)
    private Integer puntajeMaximo;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    @Column(name = "screenshot_url")
    private String screenshotUrl;

    // Contador de reportes de la comunidad (a los 3 se elimina)
    @Column(nullable = false)
    private Integer reportes = 0;

    // Estado de validación por parte de moderadores o sistema
    @Column(nullable = false)
    private Boolean verificado = false;

    // Fecha en la que se registró el récord
    @Column(name = "fecha_carga")
    private LocalDateTime fechaCarga;

    public Puntaje() {}

    // Constructor actualizado para incluir la evidencia y el modo
    public Puntaje(Usuario usuario, String juego, String modo, Integer puntajeMaximo, String screenshotUrl) {
        this.usuario = usuario;
        this.juego = juego;
        this.modo = modo;
        this.puntajeMaximo = puntajeMaximo;
        this.screenshotUrl = screenshotUrl;
        this.reportes = 0;
        this.verificado = false;
    }

    // Se ejecuta automáticamente antes de insertar en la DB
    @PrePersist
    protected void onCreate() {
        this.fechaCarga = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    
    public String getJuego() { return juego; }
    public void setJuego(String juego) { this.juego = juego; }

    public String getModo() { return modo; }
    public void setModo(String modo) { this.modo = modo; }
    
    public Integer getPuntajeMaximo() { return puntajeMaximo; }
    public void setPuntajeMaximo(Integer puntajeMaximo) { this.puntajeMaximo = puntajeMaximo; }

    public String getScreenshotUrl() { return screenshotUrl; }
    public void setScreenshotUrl(String screenshotUrl) { this.screenshotUrl = screenshotUrl; }

    public Integer getReportes() { return reportes; }
    public void setReportes(Integer reportes) { this.reportes = reportes; }

    public Boolean getVerificado() { return verificado; }
    public void setVerificado(Boolean verificado) { this.verificado = verificado; }

    public LocalDateTime getFechaCarga() { return fechaCarga; }
    public void setFechaCarga(LocalDateTime fechaCarga) { this.fechaCarga = fechaCarga; }
}
