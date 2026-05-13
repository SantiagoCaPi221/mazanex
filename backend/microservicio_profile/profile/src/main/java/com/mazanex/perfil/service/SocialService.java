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

    @Transactional
    public Map<String, String> sendRequest(Long senderId, Long receiverId) {
        if (senderId == null || receiverId == null) {
            return Map.of("status", "INVALID_PARAMS");
        }

        if (senderId.equals(receiverId)) {
            return Map.of("status", "SELF_REQUEST_ERROR");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender no encontrado con ID: " + senderId));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver no encontrado con ID: " + receiverId));

        if (requestRepository.existsBySenderIdAndReceiverId(senderId, receiverId)) {
            return Map.of("status", "ALREADY_SENT");
        }

        requestRepository.save(new FriendRequest(sender, receiver, "PENDING"));
        
        String msg = sender.getName() + " te ha enviado una solicitud de amistad.";
        notificationRepository.save(new Notification(receiver, "FRIEND_REQUEST", msg, senderId));
        
        return Map.of("status", "PENDING");
    }

    @Transactional
    public Map<String, String> acceptRequest(Long senderId, Long receiverId) {
        return requestRepository.findBySenderIdAndReceiverId(senderId, receiverId).map(req -> {
            req.setStatus("ACCEPTED");
            requestRepository.save(req);
            
            User sender = req.getSender();
            User receiver = req.getReceiver();
            
            if (!followerRepository.existsByFollowerAndFollowed(sender, receiver)) {
                followerRepository.save(new Follower(sender, receiver));
            }
            if (!followerRepository.existsByFollowerAndFollowed(receiver, sender)) {
                followerRepository.save(new Follower(receiver, sender));
            }
            
            notificationRepository.save(new Notification(sender, "FRIEND_ACCEPT", 
                receiver.getName() + " aceptó tu solicitud.", receiverId));
            
            return Map.of("status", "ACCEPTED");
        }).orElse(Map.of("status", "ERROR"));
    }

    public Map<String, Object> getRelationshipStatus(Long idA, Long idB) {
        Map<String, Object> response = new HashMap<>();
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

    @Transactional public void cancelRequest(Long senderId, Long receiverId) {
        requestRepository.findBySenderIdAndReceiverId(senderId, receiverId).ifPresent(requestRepository::delete);
    }

    @Transactional public void removeFriend(Long userId, Long friendId) {
        requestRepository.findBySenderIdAndReceiverId(userId, friendId).ifPresent(requestRepository::delete);
        requestRepository.findBySenderIdAndReceiverId(friendId, userId).ifPresent(requestRepository::delete);
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

    @Transactional public void markAsRead(Long userId) {
        userRepository.findById(userId).ifPresent(u -> {
            List<Notification> notes = notificationRepository.findByTargetUserOrderByDateDesc(u);
            notes.forEach(n -> n.setRead(true));
            notificationRepository.saveAll(notes);
        });
    }

    public Map<String, Object> getPublicProfile(Long id) {
        return userRepository.findById(id).map(u -> {
            Map<String, Object> p = new HashMap<>();
            p.put("id", u.getId());
            p.put("name", u.getName());
            p.put("bio", u.getBio());
            p.put("avatarUrl", u.getAvatarUrl());
            p.put("bannerUrl", u.getBannerUrl());
            return p;
        }).orElse(Collections.emptyMap());
    }

    public List<Long> getFollowingIds(Long id) {
        return userRepository.findById(id)
                .map(u -> followerRepository.findByFollower(u).stream().map(f -> f.getFollowed().getId()).toList())
                .orElse(Collections.emptyList());
    }
}
