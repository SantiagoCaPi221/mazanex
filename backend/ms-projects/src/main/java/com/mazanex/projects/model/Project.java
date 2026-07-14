package com.mazanex.projects.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entidad que representa un proyecto del sistema.
 */
@Entity
@Table(name = "projects")
@Data
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String status;
}