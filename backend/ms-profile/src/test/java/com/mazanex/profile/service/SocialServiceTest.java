package com.mazanex.profile.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import com.mazanex.profile.model.User;
import com.mazanex.profile.model.Follower;
import com.mazanex.profile.model.FriendRequest;
import com.mazanex.profile.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Map;
import java.util.Optional;
import com.mazanex.profile.model.Notification;
import java.util.List;

/**
 * Pruebas unitarias del servicio social y de relaciones entre usuarios.
 */
@ExtendWith(MockitoExtension.class)
public class SocialServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private FriendRequestRepository requestRepository;
    @Mock private NotificationRepository notificationRepository;
    @InjectMocks private SocialService socialService;
    @Mock private FollowerRepository followerRepository;
    
    

    @Test
    void sendRequest_ShouldReturnAlreadySent_IfRequestExists() {
        // Arrange
        User sender = new User();
        User receiver = new User();
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(userRepository.findById(2L)).thenReturn(Optional.of(receiver));
        
        // CORRECCION: Sin los nombres de parámetros (senderId:, receiverId:)
        when(requestRepository.existsBySenderIdAndReceiverId(1L, 2L)).thenReturn(true);

        // Act
        Map<String, String> result = socialService.sendRequest(1L, 2L);

        // Assert
        assertEquals("ALREADY_SENT", result.get("status"));
        verify(requestRepository, never()).save(any());
    }

    @Test
    void cancelRequest_ShouldDeleteRequest() {
        // Arrange
        when(requestRepository.findBySenderIdAndReceiverId(1L, 2L))
            .thenReturn(Optional.of(new FriendRequest()));

        // Act
        socialService.cancelRequest(1L, 2L);

        // Assert
        verify(requestRepository).delete(any(FriendRequest.class));
    }
    
    @Test
    void removeFriend_ShouldDeleteRequestsAndFollowers_WhenRelationshipExists() {
        // Arrange
        User user = new User(); user.setId(1L); user.setName("Usuario 1");
        User friend = new User(); friend.setId(2L); friend.setName("Usuario 2");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.findById(2L)).thenReturn(Optional.of(friend));

        // Usamos el constructor con parámetros que tienes en tu código
        FriendRequest request = new FriendRequest(user, friend, "PENDING");
        when(requestRepository.findBySenderIdAndReceiverId(1L, 2L)).thenReturn(Optional.of(request));
        when(requestRepository.findBySenderIdAndReceiverId(2L, 1L)).thenReturn(Optional.empty());

        // Usamos el constructor con parámetros
        Follower followerRelation = new Follower(user, friend);
        when(followerRepository.findByFollowerAndFollowed(user, friend)).thenReturn(Optional.of(followerRelation));
        when(followerRepository.findByFollowerAndFollowed(friend, user)).thenReturn(Optional.empty());

        // Act
        socialService.removeFriend(1L, 2L);

        // Assert
        verify(requestRepository).delete(request);
        verify(followerRepository).delete(followerRelation);
    }

    @Test
    void markAsRead_ShouldSetReadTrueAndSave_WhenUserHasNotifications() {
        // Arrange
        User targetUser = new User(); targetUser.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(targetUser));
        
        // Usando el constructor de 4 parámetros que tienes en tu código real
        Notification n1 = new Notification(targetUser, "TYPE", "Msg 1", 2L);
        n1.setRead(false);
        Notification n2 = new Notification(targetUser, "TYPE", "Msg 2", 3L);
        n2.setRead(false);
        
        when(notificationRepository.findByTargetUserOrderByDateDesc(targetUser))
            .thenReturn(List.of(n1, n2));
        
        // Act
        socialService.markAsRead(1L);
        
        // Assert
        assertTrue(n1.isRead()); // Si Lombok generó un getRead(), cámbialo a n1.getRead()
        assertTrue(n2.isRead());
        verify(notificationRepository).saveAll(any()); // any() es más seguro que anyList()
    }

    @Test
    void getPublicProfile_ShouldReturnMap_WhenUserExists() {
        // Arrange
        User user = new User(); 
        user.setId(1L); 
        user.setName("Bruno"); 
        user.setAvatarUrl("bruno.png");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        // Act
        Map<String, Object> result = socialService.getPublicProfile(1L);
        
        // Assert
        assertFalse(result.isEmpty());
        assertEquals(1L, result.get("id"));
        assertEquals("Bruno", result.get("name"));
        assertEquals("bruno.png", result.get("avatarUrl"));
    }

    @Test
    void cancelRequest_ShouldDeleteRequest_WhenExists() {
        // Arrange
        User sender = new User(); sender.setId(1L);
        User receiver = new User(); receiver.setId(2L);
        FriendRequest req = new FriendRequest(sender, receiver, "PENDING");
        
        when(requestRepository.findBySenderIdAndReceiverId(1L, 2L)).thenReturn(Optional.of(req));
        
        // Act
        socialService.cancelRequest(1L, 2L);
        
        // Assert
        verify(requestRepository).delete(req);
    }

    @Test
    void getFollowingIds_ShouldReturnList_WhenUserExists() {
        // Arrange
        User user = new User(); user.setId(1L);
        User followed = new User(); followed.setId(2L);
        Follower followerRelation = new Follower(user, followed);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(followerRepository.findByFollower(user)).thenReturn(List.of(followerRelation));

        // Act
        List<Long> ids = socialService.getFollowingIds(1L);

        // Assert
        assertEquals(1, ids.size());
        assertEquals(2L, ids.get(0));
    }
    
}