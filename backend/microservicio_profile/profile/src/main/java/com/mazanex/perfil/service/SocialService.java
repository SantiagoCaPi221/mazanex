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
        if (senderId.equals(receiverId)) return Map.of("status", "SELF_ERROR");

        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        if (requestRepository.existsBySenderIdAndReceiverId(senderId, receiverId)) {
            return Map.of("status", "ALREADY_SENT");
        }

        // Guardamos la solicitud
        requestRepository.save(new FriendRequest(sender, receiver, "PENDING"));
        
        // Guardamos la notificación
        String msg = sender.getName() + " te envió una solicitud.";
        notificationRepository.save(new Notification(receiver, "FRIEND_REQUEST", msg, senderId));
        
        return Map.of("status", "PENDING");
    }

    @Transactional
    public Map<String, String> acceptRequest(Long senderId, Long receiverId) {
        return requestRepository.findBySenderIdAndReceiverId(senderId, receiverId).map(req -> {
            req.setStatus("ACCEPTED");
            requestRepository.save(req);
            
            User s = req.getSender();
            User r = req.getReceiver();
            
            if (!followerRepository.existsByFollowerAndFollowed(s, r)) followerRepository.save(new Follower(s, r));
            if (!followerRepository.existsByFollowerAndFollowed(r, s)) followerRepository.save(new Follower(r, s));
            
            notificationRepository.save(new Notification(s, "FRIEND_ACCEPT", r.getName() + " aceptó tu amistad.", receiverId));
            return Map.of("status", "ACCEPTED");
        }).orElse(Map.of("status", "ERROR"));
    }

    public Map<String, Object> getRelationshipStatus(Long idA, Long idB) {
        Map<String, Object> resp = new HashMap<>();
        requestRepository.findBySenderIdAndReceiverId(idA, idB).ifPresent(s -> {
            resp.put("status", s.getStatus());
            resp.put("isSender", true);
        });
        if (!resp.isEmpty()) return resp;

        requestRepository.findBySenderIdAndReceiverId(idB, idA).ifPresent(s -> {
            resp.put("status", s.getStatus());
            resp.put("isSender", false);
        });
        if (!resp.isEmpty()) return resp;

        resp.put("status", "NONE");
        return resp;
    }

    @Transactional public void cancelRequest(Long s, Long r) {
        requestRepository.findBySenderIdAndReceiverId(s, r).ifPresent(requestRepository::delete);
    }

    @Transactional public void removeFriend(Long uId, Long fId) {
        requestRepository.findBySenderIdAndReceiverId(uId, fId).ifPresent(requestRepository::delete);
        requestRepository.findBySenderIdAndReceiverId(fId, uId).ifPresent(requestRepository::delete);
        User u = userRepository.findById(uId).orElse(null);
        User f = userRepository.findById(fId).orElse(null);
        if (u != null && f != null) {
            followerRepository.findByFollowerAndFollowed(u, f).ifPresent(followerRepository::delete);
            followerRepository.findByFollowerAndFollowed(f, u).ifPresent(followerRepository::delete);
        }
    }

    public List<Notification> getNotifications(Long uId) {
        return userRepository.findById(uId)
                .map(notificationRepository::findByTargetUserOrderByDateDesc)
                .orElse(Collections.emptyList());
    }

    @Transactional public void markAsRead(Long uId) {
        userRepository.findById(uId).ifPresent(u -> {
            List<Notification> n = notificationRepository.findByTargetUserOrderByDateDesc(u);
            n.forEach(x -> x.setRead(true));
            notificationRepository.saveAll(n);
        });
    }

    public Map<String, Object> getPublicProfile(Long id) {
        return userRepository.findById(id).map(u -> {
            Map<String, Object> p = new HashMap<>();
            p.put("id", u.getId());
            p.put("name", u.getName());
            p.put("avatarUrl", u.getAvatarUrl());
            return p;
        }).orElse(Collections.emptyMap());
    }

    public List<Long> getFollowingIds(Long id) {
        return userRepository.findById(id).map(u -> followerRepository.findByFollower(u).stream().map(f -> f.getFollowed().getId()).toList()).orElse(Collections.emptyList());
    }
}
