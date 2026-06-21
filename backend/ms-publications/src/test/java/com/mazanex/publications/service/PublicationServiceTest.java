package com.mazanex.publications.service;

import com.mazanex.publications.dto.CommentDto;
import com.mazanex.publications.dto.PublicationDto;
import com.mazanex.publications.model.Comment;
import com.mazanex.publications.model.Publication;
import com.mazanex.publications.repository.PublicationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PublicationServiceTest {

    @Mock
    private PublicationRepository publicationRepository;

    @InjectMocks
    private PublicationService publicationService;

    @Test
    void getFeed_ShouldReturnListOfPublications() {
        // Arrange
        when(publicationRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(new Publication(), new Publication()));

        // Act
        List<Publication> result = publicationService.getFeed();

        // Assert
        assertEquals(2, result.size());
        verify(publicationRepository).findAllByOrderByCreatedAtDesc();
    }

    @Test
    void getUserPublications_ShouldReturnAuthorPublications() {
        // Arrange
        when(publicationRepository.findByAuthorIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(new Publication()));

        // Act
        List<Publication> result = publicationService.getUserPublications(1L);

        // Assert
        assertEquals(1, result.size());
        verify(publicationRepository).findByAuthorIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void createPublication_ShouldMapDtoAndSave() {
        // Arrange
        PublicationDto dto = new PublicationDto();
        dto.setAuthorId(1L);
        dto.setAuthorName("Bruno");
        dto.setContent("Primer post de Mazanex");

        Publication pub = new Publication();
        pub.setId(1L);
        pub.setAuthorName("Bruno");

        when(publicationRepository.save(any(Publication.class))).thenReturn(pub);

        // Act
        Publication result = publicationService.createPublication(dto);

        // Assert
        assertNotNull(result);
        assertEquals("Bruno", result.getAuthorName());
        verify(publicationRepository).save(any(Publication.class));
    }

    @Test
    void toggleLike_ShouldAddLike_WhenUserHasNotLikedYet() {
        // Arrange
        Publication pub = new Publication();
        pub.setId(1L); // Inicialmente likedBy está vacío

        when(publicationRepository.findById(1L)).thenReturn(Optional.of(pub));

        // Act
        Map<String, Object> response = publicationService.toggleLike(1L, 99L);

        // Assert
        assertTrue((Boolean) response.get("liked"));
        assertEquals(1, response.get("totalLikes"));
        verify(publicationRepository).save(pub);
    }

    @Test
    void toggleLike_ShouldRemoveLike_WhenUserAlreadyLiked() {
        // Arrange
        Publication pub = new Publication();
        pub.setId(1L);
        pub.getLikedBy().add(99L); // El usuario 99L ya le dio like

        when(publicationRepository.findById(1L)).thenReturn(Optional.of(pub));

        // Act
        Map<String, Object> response = publicationService.toggleLike(1L, 99L);

        // Assert
        assertFalse((Boolean) response.get("liked")); // Debería haber quitado el like
        assertEquals(0, response.get("totalLikes"));
    }

    @Test
    void toggleLike_ShouldThrowException_WhenPublicationNotFound() {
        // Arrange
        when(publicationRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> publicationService.toggleLike(1L, 99L));
    }

    @Test
    void addComment_ShouldAddCommentToListAndSave() {
        // Arrange
        Publication pub = new Publication();
        pub.setId(1L);

        CommentDto dto = new CommentDto();
        dto.setAuthorId(2L);
        dto.setAuthorName("Comentarista");
        dto.setContent("¡Excelente post!");

        when(publicationRepository.findById(1L)).thenReturn(Optional.of(pub));
        when(publicationRepository.save(any(Publication.class))).thenReturn(pub);

        // Act
        Publication result = publicationService.addComment(1L, dto);

        // Assert
        assertEquals(1, result.getComments().size());
        assertEquals("¡Excelente post!", result.getComments().get(0).getContent());
        verify(publicationRepository).save(pub);
    }

    @Test
    void deletePublication_ShouldDelete_WhenUserIsAuthor() {
        // Arrange
        Publication pub = new Publication();
        pub.setId(1L);
        pub.setAuthorId(10L); // El autor es el usuario 10

        when(publicationRepository.findById(1L)).thenReturn(Optional.of(pub));

        // Act
        publicationService.deletePublication(1L, 10L); // El usuario 10 intenta borrarlo

        // Assert
        verify(publicationRepository).delete(pub);
    }

    @Test
    void deletePublication_ShouldThrowException_WhenUserIsNotAuthor() {
        // Arrange
        Publication pub = new Publication();
        pub.setId(1L);
        pub.setAuthorId(10L); // El autor es el 10

        when(publicationRepository.findById(1L)).thenReturn(Optional.of(pub));

        // Act & Assert
        // El usuario 99 intenta borrar el post del usuario 10, debe lanzar IllegalStateException
        IllegalStateException exception = assertThrows(IllegalStateException.class, 
            () -> publicationService.deletePublication(1L, 99L));
            
        assertEquals("No tienes permiso para borrar esto", exception.getMessage());
        verify(publicationRepository, never()).delete(any());
    }
}