package com.mazanex.profile.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import java.util.List;

/**
 * Pruebas unitarias del servicio de perfiles.
 */
@ExtendWith(MockitoExtension.class)
public class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProfileService profileService;

    @Test
    void syncProfile_ShouldCreateNewUser_WhenUserDoesNotExist() {
        // Arrange: Preparamos un usuario que no existe en la base de datos
        User data = new User();
        data.setId(1L);
        data.setEmail("test@mazanex.com");
        when(userRepository.findByEmail(data.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(data);

        // Act: Ejecutamos la sincronizacion
        User result = profileService.syncProfile(data);

        // Assert: Verificamos que el usuario se haya guardado y tenga el ID correcto
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateProfile_ShouldUpdateOnlyNonNullFields() {
        // Arrange: Simulamos que el usuario ya existe con un nombre original
        Long id = 1L;
        User existing = new User();
        existing.setName("Original");
        User updates = new User();
        updates.setName("Nuevo");
        
        when(userRepository.findById(id)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenReturn(existing);

        // Act: Intentamos actualizar el perfil
        profileService.updateProfile(id, updates);

        // Assert: Comprobamos que el nombre se haya actualizado correctamente
        assertEquals("Nuevo", existing.getName());
    }
    
    @Test
    void syncProfile_ShouldCreateNewUser_WhenUserNotFound() {
    // Arrange: Simulamos que findByEmail devuelve un Optional vacío
    User data = new User();
    data.setEmail("nuevo@test.com");
    when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
    when(userRepository.save(any(User.class))).thenReturn(data);

    // Act
    profileService.syncProfile(data);

    // Assert
    verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void updateProfile_ShouldUpdateAllFields_WhenUserExists() {
        // Arrange
        User existingUser = new User();
        existingUser.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));

        User newData = new User();
        newData.setName("Nuevo Nombre");
        newData.setAvatarUrl("avatar.png");
        newData.setBannerUrl("banner.png");
        newData.setBio("Nueva bio");
        newData.setBackgroundUrl("bg.png");

        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // Act
        User result = profileService.updateProfile(1L, newData);

        // Assert
        assertNotNull(result);
        assertEquals("Nuevo Nombre", existingUser.getName());
        assertEquals("Nueva bio", existingUser.getBio());
        verify(userRepository).save(existingUser);
    }

    @Test
    void syncProfile_ShouldCreateNewUser_WhenEmailNotFound() {
        // Arrange
        User newData = new User();
        newData.setId(99L);
        newData.setEmail("nuevo@test.com");
        newData.setName("Nuevo Usuario");

        // Simulamos que NO encuentra el email para forzar el orElseGet
        when(userRepository.findByEmail("nuevo@test.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(newData);

        // Act
        User result = profileService.syncProfile(newData);

        // Assert
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void listAll_ShouldReturnUserList() {
        // Arrange
        when(userRepository.findAll()).thenReturn(List.of(new User(), new User()));
        
        // Act
        List<User> result = profileService.listAll();
        
        // Assert
        assertEquals(2, result.size());
        verify(userRepository).findAll();
    }

    @Test
    void delete_ShouldCallRepository() {
        // Act
        profileService.delete(1L);
        
        // Assert
        verify(userRepository).deleteById(1L);
    }

    @Test
    void syncProfile_ShouldUpdateExistingUser_WhenEmailExists() {
        // Arrange
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("test@test.com");

        User newData = new User();
        newData.setEmail("test@test.com");
        newData.setName("Actualizado");
        newData.setBio("Nueva bio");

        // Simulamos que SÍ encuentra el email
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // Act
        User result = profileService.syncProfile(newData);

        // Assert
        assertNotNull(result);
        assertEquals("Actualizado", existingUser.getName());
        verify(userRepository).save(existingUser);
    }
}