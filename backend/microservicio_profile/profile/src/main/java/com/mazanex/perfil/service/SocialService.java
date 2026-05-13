package com.mazanex.profile.service;

import com.mazanex.profile.model.*;
import com.mazanex.profile.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class SocialService {

    @Autowired private UserRepository userRepository;
    @Autowired private FollowerRepository followerRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private FriendRequestRepository requestRepository;

    @Transactional // IMPORTANTE: Para que si falla la notificación, no se guarde la solicitud (o viceversa)
    public Map<String, String> sendRequest(Long senderId, Long receiverId) {
        try {
            if (senderId.equals(receiverId)) {
                return Map.of("status", "SELF_REQUEST_ERROR");
            }

            User sender = userRepository.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));
            User receiver = userRepository.findById(receiverId)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            // Verificar si ya existe en cualquier dirección
            boolean alreadySent = requestRepository.existsBySenderAndReceiver(sender, receiver);
            boolean alreadyReceived = requestRepository.existsBySenderAndReceiver(receiver, sender);

            if (alreadySent || alreadyReceived) {
                return Map.of("status", "ALREADY_SENT");
            }

            // Guardar solicitud
            requestRepository.save(new FriendRequest(sender, receiver, "PENDING"));
            
            // Guardar notificación
            String msg = sender.getName() + " te ha enviado una solicitud de amistad.";
            notificationRepository.save(new Notification(receiver, "FRIEND_REQUEST", msg, senderId));
            
            return Map.of("status", "PENDING");
        } catch (Exception e) {
            System.err.println("Error en sendRequest: " + e.getMessage());
            return Map.of("status", "ERROR");
        }
    }

    @Transactional
    public Map<String, String> acceptRequest(Long senderId, Long receiverId) {
        return requestRepository.findBySenderAndReceiverId(senderId, receiverId).map(req -> {
            req.setStatus("ACCEPTED");
            requestRepository.save(req);
            
            User sender = req.getSender();
            User receiver = req.getReceiver();
            
            // Evitar duplicados en seguidores
            if (!followerRepository.existsByFollowerAndFollowed(sender, receiver)) {
                followerRepository.save(new Follower(sender, receiver));
            }
            if (!followerRepository.existsByFollowerAndFollowed(receiver, sender)) {
                followerRepository.save(new Follower(receiver, sender));
            }
            
            notificationRepository.save(new Notification(sender, "FRIEND_ACCEPT", 
                receiver.getName() + " aceptó tu amistad.", receiverId));
            
            return Map.of("status", "ACCEPTED");
        }).orElse(Map.of("status", "ERROR"));
    }

    public Map<String, Object> getRelationshipStatus(Long idA, Long idB) {
        Map<String, Object> response = new HashMap<>();
        
        // Buscamos la solicitud en ambas direcciones
        var sol1 = requestRepository.findBySenderIdAndReceiverId(idA, idB);
        if (sol1.isPresent()) {
            response.put("status", sol1.get().getStatus());
            response.put("isSender", true);
            return response;
        }

        var sol2 = requestRepository.findBySenderIdAndReceiverId(idB, idA);
        if (sol2.isPresent()) {
            response.put("status", sol2.get().getStatus());
            response.put("isSender", false);
            return response;
        }

        response.put("status", "NONE");
        return response;
    }

    @Transactional
    public void cancelRequest(Long senderId, Long receiverId) {
        requestRepository.findBySenderIdAndReceiverId(senderId, receiverId)
                .ifPresent(requestRepository::delete);
    }

    @Transactional
    public void removeFriend(Long userId, Long friendId) {
        // Limpiar solicitudes
        requestRepository.findBySenderIdAndReceiverId(userId, friendId).ifPresent(requestRepository::delete);
        requestRepository.findBySenderIdAndReceiverId(friendId, userId).ifPresent(requestRepository::delete);
        
        // Limpiar seguidores (Amistad bidireccional)
        User u = userRepository.findById(userId).orElse(null);
        User f = userRepository.findById(friendId).orElse(null);
        
        if (u != null && f != null) {
            followerRepository.findByFollowerAndFollowed(u, f).ifPresent(followerRepository::delete);
            followerRepository.findByFollowerAndFollowed(f, u).ifPresent(followerRepository::delete);
        }
    }

    public List<Notification> getNotifications(Long userId) {
        return userRepository.findById(userId)
                .map(notificationRepository::findByTargetUserOrderByDateDesc)
                .orElse(Collections.emptyList());
    }

    @Transactional
    public void markAsRead(Long userId) {
        userRepository.findById(userId).ifPresent(u -> {
            List<Notification> notes = notificationRepository.findByTargetUserOrderByDateDesc(u);
            notes.forEach(n -> n.setRead(true));
            notificationRepository.saveAll(notes); // Más eficiente que guardar una por una
        });
    }

    // ... resto de métodos (getPublicProfile, getFollowingIds) se ven bien
}
