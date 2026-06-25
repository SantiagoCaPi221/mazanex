package com.mazanex.profile.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.mazanex.profile.model.User;
import com.mazanex.profile.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoSettings;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.List;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT) // Esto permite ignorar discrepancias de argumentos
public class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ProfileService profileService;

    @Test
    void updateProfile_ShouldUpdateOnlyNonNullFields() {
        Long id = 1L;
        User existing = new User();
        existing.setName("Original");
        User updates = new User();
        updates.setName("Nuevo");
        
        when(userRepository.findById(id)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenReturn(existing);
        
        // Configuramos el mock de forma permisiva
        when(restTemplate.postForEntity(any(), any(), any()))
            .thenReturn(new ResponseEntity<>(HttpStatus.OK));

        profileService.updateProfile(id, updates);

        assertEquals("Nuevo", existing.getName());
    }

    @Test
    void updateProfile_ShouldUpdateAllFields_WhenUserExists() {
        User existingUser = new User();
        existingUser.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));

        User newData = new User();
        newData.setName("Nuevo Nombre");

        when(userRepository.save(any(User.class))).thenReturn(existingUser);
        
        // Configuramos el mock de forma permisiva
        when(restTemplate.postForEntity(any(), any(), any()))
            .thenReturn(new ResponseEntity<>(HttpStatus.OK));

        User result = profileService.updateProfile(1L, newData);

        assertNotNull(result);
        assertEquals("Nuevo Nombre", existingUser.getName());
    }

    @Test
    void syncProfile_ShouldCreateNewUser_WhenUserDoesNotExist() {
        User data = new User();
        data.setId(1L);
        data.setEmail("test@mazanex.com");
        when(userRepository.findByEmail(data.getEmail())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(data);
        
        User result = profileService.syncProfile(data);
        
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void syncProfile_ShouldCreateNewUser_WhenUserNotFound() {
        User data = new User();
        data.setEmail("nuevo@test.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(data);
        profileService.syncProfile(data);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void listAll_ShouldReturnUserList() {
        when(userRepository.findAll()).thenReturn(List.of(new User(), new User()));
        List<User> result = profileService.listAll();
        assertEquals(2, result.size());
    }

    @Test
    void delete_ShouldCallRepository() {
        profileService.delete(1L);
        verify(userRepository).deleteById(1L);
    }
}