package com.mazanex.perfil.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "solicitudes_amistad")
@Data
@NoArgsConstructor
public class SolicitudAmistad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Usuario solicitante;

    @ManyToOne
    private Usuario receptor;

    private String estado; // "PENDIENTE", "ACEPTADA", "RECHAZADA"

    public SolicitudAmistad(Usuario solicitante, Usuario receptor, String estado) {
        this.solicitante = solicitante;
        this.receptor = receptor;
        this.estado = estado;
    }
}
