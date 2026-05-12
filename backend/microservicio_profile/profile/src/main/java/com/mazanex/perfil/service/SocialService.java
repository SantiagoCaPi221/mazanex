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

    public Map<String, String> sendRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        if (requestRepository.existsBySenderAndReceiver(sender, receiver)) {
            return Map.of("status", "ALREADY_SENT");
        }

        requestRepository.save(new FriendRequest(sender, receiver, "PENDING"));
        
        String msg = sender.getName() + " te ha enviado una solicitud de amistad.";
        notificationRepository.save(new Notification(receiver, "FRIEND_REQUEST", msg, senderId));
        return Map.of("status", "PENDING");
    }

    @Transactional
    public Map<String, String> acceptRequest(Long senderId, Long receiverId) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        return requestRepository.findBySenderAndReceiver(sender, receiver).map(req -> {
            req.setStatus("ACCEPTED");
            requestRepository.save(req);
            
            followerRepository.save(new Follower(sender, receiver));
            followerRepository.save(new Follower(receiver, sender));
            
            notificationRepository.save(new Notification(sender, "FRIEND_ACCEPT", 
                receiver.getName() + " aceptó tu amistad.", receiverId));
            return Map.of("status", "ACCEPTED");
        }).orElse(Map.of("status", "ERROR"));
    }

    public Map<String, Object> getRelationshipStatus(Long idA, Long idB) {
        User a = userRepository.findById(idA).orElseThrow();
        User b = userRepository.findById(idB).orElseThrow();
        Map<String, Object> response = new HashMap<>();
        
        var sol1 = requestRepository.findBySenderAndReceiver(a, b);
        if (sol1.isPresent()) {
            response.put("status", sol1.get().getStatus());
            response.put("isSender", true);
            return response;
        }

        var sol2 = requestRepository.findBySenderAndReceiver(b, a);
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
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        requestRepository.findBySenderAndReceiver(sender, receiver).ifPresent(requestRepository::delete);
    }

    @Transactional
    public void removeFriend(Long userId, Long friendId) {
        User user = userRepository.findById(userId).orElseThrow();
        User friend = userRepository.findById(friendId).orElseThrow();
        requestRepository.findBySenderAndReceiver(user, friend).ifPresent(requestRepository::delete);
        requestRepository.findBySenderAndReceiver(friend, user).ifPresent(requestRepository::delete);
        followerRepository.findByFollowerAndFollowed(user, friend).ifPresent(followerRepository::delete);
        followerRepository.findByFollowerAndFollowed(friend, user).ifPresent(followerRepository::delete);
    }

    public List<Notification> getNotifications(Long userId) {
        User u = userRepository.findById(userId).orElseThrow();
        return notificationRepository.findByTargetUserOrderByDateDesc(u);
    }

    @Transactional
    public void markAsRead(Long userId) {
        User u = userRepository.findById(userId).orElseThrow();
        notificationRepository.findByTargetUserOrderByDateDesc(u).forEach(n -> {
            if (!n.isRead()) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }

    public Map<String, Object> getPublicProfile(Long id) {
        User u = userRepository.findById(id).orElseThrow();
        Map<String, Object> p = new HashMap<>();
        p.put("id", u.getId());
        p.put("name", u.getName());
        p.put("bio", u.getBio());
        p.put("avatarUrl", u.getAvatarUrl());
        p.put("bannerUrl", u.getBannerUrl());
        p.put("backgroundUrl", u.getBackgroundUrl());
        return p;
    }

    public List<Long> getFollowingIds(Long id) {
        User u = userRepository.findById(id).orElseThrow();
        return followerRepository.findByFollower(u).stream()
                .map(f -> f.getFollowed().getId()).toList();
    }
}