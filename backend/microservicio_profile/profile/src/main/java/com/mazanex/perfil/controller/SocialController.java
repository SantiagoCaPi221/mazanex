package com.mazanex.profile.controller;

import com.mazanex.profile.model.Notification;
import com.mazanex.profile.service.SocialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/profile/social")
@CrossOrigin(origins = "*")
public class SocialController {

    @Autowired
    private SocialService socialService;

    @PostMapping("/send-request/{senderId}/{receiverId}")
    public ResponseEntity<Map<String, String>> sendRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        return ResponseEntity.ok(socialService.sendRequest(senderId, receiverId));
    }

    @PostMapping("/accept-request/{senderId}/{receiverId}")
    public ResponseEntity<Map<String, String>> acceptRequest(@PathVariable Long senderId, @PathVariable Long receiverId) {
        return ResponseEntity.ok(socialService.acceptRequest(senderId, receiverId));
    }

    @GetMapping("/status/{idA}/{idB}")
    public ResponseEntity<Map<String, Object>> getStatus(@PathVariable Long idA, @PathVariable Long idB) {
        return ResponseEntity.ok(socialService.getRelationshipStatus(idA, idB));
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(socialService.getNotifications(userId));
    }

    @PutMapping("/notifications/{userId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long userId) {
        socialService.markAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove-friend/{userId}/{friendId}")
    public ResponseEntity<Map<String, String>> removeFriend(@PathVariable Long userId, @PathVariable Long friendId) {
        socialService.removeFriend(userId, friendId);
        return ResponseEntity.ok(Map.of("status", "NONE"));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Map<String, Object>> getPublic(@PathVariable Long id) {
        return ResponseEntity.ok(socialService.getPublicProfile(id));
    }
}