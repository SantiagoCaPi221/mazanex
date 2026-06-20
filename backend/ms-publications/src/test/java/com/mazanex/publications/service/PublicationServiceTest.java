package com.mazanex.publications.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.mazanex.publications.model.Publication;
import com.mazanex.publications.repository.PublicationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Map;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class PublicationServiceTest {

    @Mock
    private PublicationRepository publicationRepository;

    @InjectMocks
    private PublicationService publicationService;

    @Test
    void toggleLike_ShouldAddLike_WhenNotLiked() {
        // Arrange: Creamos una publicación sin likes
        Publication pub = new Publication();
        pub.setId(1L);
        when(publicationRepository.findById(1L)).thenReturn(Optional.of(pub));
        when(publicationRepository.save(any(Publication.class))).thenReturn(pub);

        // Act: Damos like
        Map<String, Object> result = publicationService.toggleLike(1L, 100L);

        // Assert: Verificamos que el estado ahora es "liked" y el contador es 1
        assertEquals(true, result.get("liked"));
        assertEquals(1, (int) result.get("totalLikes"));
        verify(publicationRepository).save(pub);
    }

    @Test
    void toggleLike_ShouldRemoveLike_WhenAlreadyLiked() {
        // Arrange: Creamos una publicación que ya tiene el like del usuario 100
        Publication pub = new Publication();
        pub.setId(1L);
        pub.toggleLike(100L); // Damos like previo
        
        when(publicationRepository.findById(1L)).thenReturn(Optional.of(pub));
        when(publicationRepository.save(any(Publication.class))).thenReturn(pub);

        // Act: Quitamos el like
        Map<String, Object> result = publicationService.toggleLike(1L, 100L);

        // Assert: Verificamos que ahora "liked" es falso y el contador es 0
        assertEquals(false, result.get("liked"));
        assertEquals(0, (int) result.get("totalLikes"));
    }
}