package com.mazanex.profile.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// IMPORTANTE: Asegúrate de que estos imports existan
import com.mazanex.profile.model.User;
import com.mazanex.profile.model.FriendRequest;
import com.mazanex.profile.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Map;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class SocialServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private FriendRequestRepository requestRepository;
    @Mock private NotificationRepository notificationRepository;
    @InjectMocks private SocialService socialService;

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
}