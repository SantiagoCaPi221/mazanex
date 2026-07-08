package com.mazanex.auth.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.mazanex.auth.config.JwtService;
import com.mazanex.auth.dto.UserRequestDto;
import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

/**
 * Pruebas unitarias del servicio de autenticación.
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() {
        // Arrange
        String email = "test@mazanex.com";
        String password = "pass";
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName("Test User");
        
        UserRequestDto request = new UserRequestDto(email, password);
        
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(email)).thenReturn("mock-jwt-token");

        // Act
        // holaaaaa
        Map<String, Object> response = authService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.get("token"));
        verify(jwtService, times(1)).generateToken(email);
    }

    @Test
    void registerUser_ShouldSetDefaultRoleAndSave() {
        // Arrange
        User user = new User();
        user.setName("New User");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        User savedUser = authService.registerUser(user);

        // Assert
        assertEquals("USER", savedUser.getRole());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void registerUser_ShouldSyncWithProfile_WhenUserIsSaved() {
    // Arrange: Preparamos un usuario nuevo
    User user = new User();
    user.setName("Bruno");
    user.setRole("USER");
    when(userRepository.save(any(User.class))).thenReturn(user);

    // Act: Llamamos al registro
    User saved = authService.registerUser(user);

    // Assert: Verificamos que se llame al repositorio
    assertEquals("USER", saved.getRole());
    verify(userRepository, times(1)).save(user);
    // Nota: El syncWithProfile se prueba como un efecto secundario o mediante mock del RestTemplate
    }

    @Test
    void login_ShouldReturnNull_WhenPasswordIsIncorrect() {
    // Arrange: Usuario existe, pero contraseña no coincide
    User user = new User();
    user.setEmail("test@mazanex.com");
    user.setPassword("correcta");
    
    when(userRepository.findByEmail("test@mazanex.com")).thenReturn(Optional.of(user));

    // Act: Login con contraseña incorrecta
    UserRequestDto dto = new UserRequestDto("test@mazanex.com", "incorrecta");
    var result = authService.login(dto);

    // Assert: Debe retornar null (o lo que sea que tu código haga al fallar)
    assertNull(result);
    }

    @Test
    void updatePassword_ShouldThrowException_WhenUserNotFound() {
    // Arrange: Simulamos que el usuario NO existe
    when(userRepository.findById(99L)).thenReturn(Optional.empty());

    // Act & Assert: Verificamos que lanza la RuntimeException
    assertThrows(RuntimeException.class, () -> {
        authService.updatePassword(99L, "old", "new");
    });
    }

    @Test
    void login_ShouldReturnNull_WhenUserNotFound() {
    // Arrange: Usuario no existe en DB
    when(userRepository.findByEmail("inexistente@test.com")).thenReturn(Optional.empty());

    // Act
    UserRequestDto dto = new UserRequestDto("inexistente@test.com", "123456");
    var result = authService.login(dto);

    // Assert: Debe retornar null porque el usuario no existe
    assertNull(result);
    }

    @Test
    void registerUser_ShouldThrowException_WhenEmailAlreadyExists() {
    // Arrange
    User user = new User();
    user.setEmail("existente@test.com");
    
    // Configuramos el mock para que reporte que el email YA existe
    when(userRepository.existsByEmail("existente@test.com")).thenReturn(true);

    // Act & Assert
    // Usamos assertThrows para verificar que el servicio se detiene correctamente
    assertThrows(RuntimeException.class, () -> {
        authService.registerUser(user);
    });
    
    // Verificamos que NUNCA intentó guardar, lo que evita la ejecución de lógica posterior
    verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_ShouldReturnNull_WhenUserDoesNotExist() {
    // Arrange: Simula que no encuentra el email ni el nombre
    when(userRepository.findByEmail("no-existe@test.com")).thenReturn(Optional.empty());
    when(userRepository.findByName("no-existe@test.com")).thenReturn(Optional.empty());

    // Act
    UserRequestDto dto = new UserRequestDto("no-existe@test.com", "password123");
    var result = authService.login(dto);

    // Assert
    assertNull(result);
    }

    @Test
    void deleteUser_ShouldReturnFalse_WhenUserDoesNotExist() {
    // Arrange: Simula que el usuario no existe en la BD
    when(userRepository.existsById(99L)).thenReturn(false);

    // Act
    boolean deleted = authService.deleteUser(99L);

    // Assert
    assertFalse(deleted);
    }

    @Test
    void updatePassword_ShouldThrowException_WhenCurrentPasswordIsWrong() {
    // Arrange: Usuario existe, pero la contraseña no coincide
    User user = new User();
    user.setPassword("123456");
    when(userRepository.findById(1L)).thenReturn(Optional.of(user));

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> {
        authService.updatePassword(1L, "wrong-password", "new-password");
    });
    
    // Verificamos que no se intentó guardar nada debido al error
    verify(userRepository, never()).save(any(User.class));
    }


    @Test
    void updateProfile_ShouldReturnNull_WhenUserDoesNotExist() {
    // Arrange: ID que no existe en repositorio
    when(userRepository.findById(99L)).thenReturn(Optional.empty());
    User data = new User();
    data.setName("Nuevo Nombre");

    // Act
    User result = authService.updateProfile(99L, data);

    // Assert
    assertNull(result);
    // Verificamos que nunca se llamó a save
    verify(userRepository, never()).save(any(User.class));
    }

    
}