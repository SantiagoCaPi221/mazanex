package com.mazanex.profile.controller;

import com.mazanex.profile.model.Notification;
import com.mazanex.profile.service.SocialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestionar solicitudes de amistad, seguimiento y notificaciones sociales.
 */
@RestController
@RequestMapping("/api/profile/social")
@Tag(name = "2. Interacciones Sociales", description = "Endpoints para manejar amistades, notificaciones y relaciones")
public class SocialController {

    @Autowired
    private SocialService socialService;

    /**
     * Envía una solicitud de amistad entre dos usuarios.
     *
     * @param senderId identificador del remitente
     * @param receiverId identificador del destinatario
     * @return respuesta HTTP con el estado de la solicitud
     */
    @PostMapping("/send-request/{senderId}/{receiverId}")
    @Operation(summary = "Enviar solicitud de amistad")
    public ResponseEntity<Map<String, String>> sendRequest(
            @PathVariable Long senderId, 
            @PathVariable Long receiverId) {
        return ResponseEntity.ok(socialService.sendRequest(senderId, receiverId));
    }

    /**
     * Acepta una solicitud de amistad previamente enviada.
     *
     * @param senderId identificador del solicitante
     * @param receiverId identificador del usuario que acepta
     * @return respuesta HTTP con el resultado del proceso
     */
    @PostMapping("/accept-request/{senderId}/{receiverId}")
    @Operation(summary = "Aceptar solicitud de amistad")
    public ResponseEntity<Map<String, String>> acceptRequest(
            @PathVariable Long senderId, 
            @PathVariable Long receiverId) {
        return ResponseEntity.ok(socialService.acceptRequest(senderId, receiverId));
    }

    /**
     * Consulta el estado de relación entre dos usuarios.
     *
     * @param idA identificador del primer usuario
     * @param idB identificador del segundo usuario
     * @return mapa con el estado y si uno de ellos es el remitente
     */
    @GetMapping("/status/{idA}/{idB}")
    @Operation(summary = "Consultar estado de relación", description = "Verifica si dos usuarios son amigos o tienen una solicitud pendiente.")
    public ResponseEntity<Map<String, Object>> getStatus(
            @PathVariable Long idA, 
            @PathVariable Long idB) {
        return ResponseEntity.ok(socialService.getRelationshipStatus(idA, idB));
    }

    @GetMapping("/following/{id}")
    @Operation(summary = "Listar amigos", description = "Obtiene la lista de IDs de los usuarios que esta persona sigue o de los que es amigo.")
    public ResponseEntity<List<Long>> getFollowing(
            @Parameter(description = "ID del usuario") @PathVariable Long id) {
        return ResponseEntity.ok(socialService.getFollowingIds(id));
    }

    @GetMapping("/notifications/{userId}")
    @Operation(summary = "Obtener notificaciones", description = "Devuelve la lista de notificaciones activas de un usuario.")
    public ResponseEntity<List<Notification>> getNotifications(
            @PathVariable Long userId) {
        return ResponseEntity.ok(socialService.getNotifications(userId));
    }

    @PutMapping("/notifications/{userId}/read")
    @Operation(summary = "Marcar notificaciones como leídas")
    public ResponseEntity<Void> markAsRead(@PathVariable Long userId) {
        socialService.markAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/cancel-request/{senderId}/{receiverId}")
    @Operation(summary = "Cancelar solicitud de amistad")
    public ResponseEntity<Map<String, String>> cancel(
            @PathVariable Long senderId, 
            @PathVariable Long receiverId) {
        socialService.cancelRequest(senderId, receiverId);
        return ResponseEntity.ok(Map.of("status", "NONE"));
    }

    @DeleteMapping("/remove-friend/{userId}/{friendId}")
    @Operation(summary = "Eliminar amigo", description = "Rompe la relación de amistad entre dos usuarios.")
    public ResponseEntity<Map<String, String>> removeFriend(
            @PathVariable Long userId, 
            @PathVariable Long friendId) {
        socialService.removeFriend(userId, friendId);
        return ResponseEntity.ok(Map.of("status", "NONE"));
    }

    @GetMapping("/public/{id}")
    @Operation(summary = "Obtener perfil público", description = "Devuelve los datos públicos de un usuario para ser mostrados a otros.")
    public ResponseEntity<Map<String, Object>> getPublic(@PathVariable Long id) {
        return ResponseEntity.ok(socialService.getPublicProfile(id));
    }
}