package com.mazanex.publications.controller;

import com.mazanex.publications.dto.CommentDto;
import com.mazanex.publications.dto.PublicationDto;
import com.mazanex.publications.model.Publication;
import com.mazanex.publications.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/publications")
@CrossOrigin(origins = "*")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    // 1. Obtener el Feed (Muro)
    @GetMapping("/feed")
    public ResponseEntity<List<Publication>> getFeed() {
        return ResponseEntity.ok(publicationService.getFeed());
    }

    // 2. Obtener publicaciones de un usuario
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Publication>> getUserPublications(@PathVariable Long userId) {
        return ResponseEntity.ok(publicationService.getUserPublications(userId));
    }

    // 3. Crear publicación
    @PostMapping
    public ResponseEntity<Publication> createPublication(@RequestBody PublicationDto dto) {
        return ResponseEntity.ok(publicationService.createPublication(dto));
    }

    // 4. Dar o quitar Like
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        try {
            return ResponseEntity.ok(publicationService.toggleLike(id, body.get("userId")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // 5. Comentar
    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody CommentDto dto) {
        try {
            return ResponseEntity.ok(publicationService.addComment(id, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // 6. Borrar (Opcional, pero muy útil)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePublication(@PathVariable Long id, @RequestParam Long userId) {
        try {
            publicationService.deletePublication(id, userId);
            return ResponseEntity.ok(Map.of("status", "DELETED"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}