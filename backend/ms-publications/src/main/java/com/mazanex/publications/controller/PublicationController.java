package com.mazanex.publications.controller;

import com.mazanex.publications.dto.CommentDto;
import com.mazanex.publications.dto.PublicationDto;
import com.mazanex.publications.model.Publication;
import com.mazanex.publications.service.PublicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/publications")
@Tag(name = "1. Publicaciones (Feed)", description = "Endpoints para la gestión del muro, posts, likes y comentarios de la comunidad")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    @GetMapping("/feed")
    @Operation(
        summary = "Obtener el Feed (Muro)", 
        description = "Devuelve la lista global de publicaciones para mostrar en el muro principal de la comunidad."
    )
    public ResponseEntity<List<Publication>> getFeed() {
        return ResponseEntity.ok(publicationService.getFeed());
    }

    @GetMapping("/user/{userId}")
    @Operation(
        summary = "Obtener publicaciones por usuario", 
        description = "Devuelve todas las publicaciones creadas por un usuario específico utilizando su ID."
    )
    public ResponseEntity<List<Publication>> getUserPublications(
            @Parameter(description = "ID del usuario creador") @PathVariable Long userId) {
        
        return ResponseEntity.ok(publicationService.getUserPublications(userId));
    }

    @PostMapping
    @Operation(
        summary = "Crear publicación", 
        description = "Permite a un usuario crear un nuevo post o publicación en el muro de la comunidad."
    )
    public ResponseEntity<Publication> createPublication(@RequestBody PublicationDto dto) {
        return ResponseEntity.ok(publicationService.createPublication(dto));
    }

    @PostMapping("/{id}/like")
    @Operation(
        summary = "Dar o quitar Like", 
        description = "Añade un 'Me gusta' a una publicación. Si el usuario ya le había dado like, lo retira (Toggle)."
    )
    public ResponseEntity<?> toggleLike(
            @Parameter(description = "ID de la publicación") @PathVariable Long id, 
            @RequestBody Map<String, Long> body) {
        
        try {
            return ResponseEntity.ok(publicationService.toggleLike(id, body.get("userId")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/comment")
    @Operation(
        summary = "Agregar comentario", 
        description = "Añade un nuevo comentario de un usuario a una publicación existente."
    )
    public ResponseEntity<?> addComment(
            @Parameter(description = "ID de la publicación a comentar") @PathVariable Long id, 
            @RequestBody CommentDto dto) {
        
        try {
            return ResponseEntity.ok(publicationService.addComment(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Eliminar publicación", 
        description = "Permite a un usuario eliminar permanentemente su publicación. Requiere validar el ID del autor."
    )
    public ResponseEntity<?> deletePublication(
            @Parameter(description = "ID de la publicación a borrar") @PathVariable Long id, 
            @Parameter(description = "ID del usuario que intenta borrarla (para validación)") @RequestParam Long userId) {
        
        try {
            publicationService.deletePublication(id, userId);
            return ResponseEntity.ok(Map.of("status", "DELETED"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}