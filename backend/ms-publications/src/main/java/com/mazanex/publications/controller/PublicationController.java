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

/**
 * Controlador REST para la gestión del muro de publicaciones de la comunidad.
 * Maneja feed, creación de posts, likes y comentarios.
 */
@RestController
@RequestMapping("/api/publications")
@Tag(
        name = "1. Publicaciones (Feed)",
        description = "Endpoints para la gestión del muro, posts, likes y comentarios de la comunidad"
)
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    /**
     * Devuelve el feed global de publicaciones ordenado por fecha descendente.
     *
     * @return lista de publicaciones para mostrar en el muro
     */
    @GetMapping("/feed")
    @Operation(
            summary = "Obtener el Feed (Muro)",
            description = "Devuelve la lista global de publicaciones para mostrar en el muro principal de la comunidad."
    )
    public ResponseEntity<List<Publication>> getFeed() {
        return ResponseEntity.ok(publicationService.getFeed());
    }

    /**
     * Obtiene todas las publicaciones creadas por un usuario concreto.
     *
     * @param userId identificador del autor
     * @return listado de publicaciones del usuario
     */
    @GetMapping("/user/{userId}")
    @Operation(
            summary = "Obtener publicaciones por usuario",
            description = "Devuelve todas las publicaciones creadas por un usuario específico utilizando su ID."
    )
    public ResponseEntity<List<Publication>> getUserPublications(
            @Parameter(description = "ID del usuario creador")
            @PathVariable("userId") Long userId) {

        return ResponseEntity.ok(
                publicationService.getUserPublications(userId)
        );
    }

    /**
     * Crea una nueva publicación en el muro.
     *
     * @param dto datos de la publicación a crear
     * @return publicación creada
     */
    @PostMapping
    @Operation(
            summary = "Crear publicación",
            description = "Permite a un usuario crear un nuevo post o publicación en el muro de la comunidad."
    )
    public ResponseEntity<Publication> createPublication(
            @RequestBody PublicationDto dto) {

        return ResponseEntity.ok(
                publicationService.createPublication(dto)
        );
    }

    /**
     * Alterna el estado de like de una publicación para un usuario.
     *
     * @param id identificador de la publicación
     * @param body cuerpo con el identificador del usuario
     * @return resultado del toggle de likes
     */
    @PostMapping("/{id}/like")
    @Operation(
            summary = "Dar o quitar Like",
            description = "Añade un 'Me gusta' a una publicación. Si el usuario ya le había dado like, lo retira (Toggle)."
    )
    public ResponseEntity<?> toggleLike(
            @Parameter(description = "ID de la publicación")
            @PathVariable("id") Long id,

            @RequestBody Map<String, Long> body) {

        try {
            return ResponseEntity.ok(
                    publicationService.toggleLike(
                            id,
                            body.get("userId")
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Añade un comentario a una publicación existente.
     *
     * @param id identificador de la publicación
     * @param dto datos del comentario
     * @return publicación actualizada con el comentario
     */
    @PostMapping("/{id}/comment")
    @Operation(
            summary = "Agregar comentario",
            description = "Añade un nuevo comentario de un usuario a una publicación existente."
    )
    public ResponseEntity<?> addComment(
            @Parameter(description = "ID de la publicación a comentar")
            @PathVariable("id") Long id,

            @RequestBody CommentDto dto) {

        try {
            return ResponseEntity.ok(
                    publicationService.addComment(id, dto)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Elimina una publicación si el usuario que la solicita es su autor.
     *
     * @param id identificador de la publicación
     * @param userId identificador del usuario solicitante
     * @return respuesta con el estado de eliminación
     */
    @DeleteMapping("/{id}/{userId}")
    @Operation(
            summary = "Eliminar publicación",
            description = "Elimina post y sus comentarios asociados."
    )
    public ResponseEntity<?> deletePublication(
            @PathVariable("id") Long id,
            @PathVariable("userId") Long userId) {

        System.out.println(
                "🚀 Borrando publicación ID: "
                        + id
                        + " | Usuario ID: "
                        + userId
        );

        try {
            publicationService.deletePublication(id, userId);

            return ResponseEntity.ok(
                    Map.of("status", "DELETED")
            );

        } catch (IllegalStateException e) {

            return ResponseEntity.status(403)
                    .body(Map.of("error", e.getMessage()));

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body(
                            Map.of(
                                    "error",
                                    "Error interno al eliminar: "
                                            + e.getMessage()
                            )
                    );
        }
    }
}