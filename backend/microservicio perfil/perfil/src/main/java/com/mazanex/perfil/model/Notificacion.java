package com.mazanex.perfil.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Data
@NoArgsConstructor
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario usuarioDestino;

    private String mensaje;
    private String tipo; // "FRIEND_REQUEST", "FRIEND_ACCEPT"
    
    // ESTE ES EL CAMPO CLAVE QUE FALTA
    private Long emisorId; 
    
    private boolean leida = false;
    private LocalDateTime fecha = LocalDateTime.now();

    // Constructor actualizado para incluir el emisorId
    public Notificacion(Usuario usuarioDestino, String tipo, String mensaje, Long emisorId) {
        this.usuarioDestino = usuarioDestino;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.emisorId = emisorId;
    }
}
