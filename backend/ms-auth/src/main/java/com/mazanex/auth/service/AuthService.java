package com.mazanex.auth.service;

import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Carga de forma dinámica la clave privada desde el archivo src/main/resources/private.pem
     */
    private PrivateKey loadPrivateKey() throws Exception {
        String key = new String(new ClassPathResource("private.pem").getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        
        // Limpiamos las cabeceras del formato PEM para dejar solo el contenido Base64
        String privateKeyPEM = key
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replaceAll(System.lineSeparator(), "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");

        byte[] encoded = Base64.getDecoder().decode(privateKeyPEM);
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(encoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(keySpec);
    }

    /**
     * Genera un token JWT firmado asimétricamente con RS256 y lo almacena en la BD
     */
    public String generateToken(User user) {
        try {
            PrivateKey privateKey = loadPrivateKey();
            long nowMillis = System.currentTimeMillis();
            Date now = new Date(nowMillis);
            Date exp = new Date(nowMillis + 7200000); // El token expira en 2 horas

            String token = Jwts.builder()
                    .subject(user.getId().toString()) // El identificador único en KrakenD (sub)
                    .claim("email", user.getEmail())
                    // Enviamos el rol dentro de una lista, que es como el validador JOSE de KrakenD prefiere leerlo
                    .claim("roles", List.of(user.getRole())) 
                    .issuer("mi-microservicio-auth") // Debe coincidir con el key_issuer de KrakenD
                    .issuedAt(now)
                    .expiration(exp)
                    .signWith(privateKey, Jwts.SIG.RS256) // Firma asimétrica con JJWT 0.12.x
                    .compact();
            
            // Guardar el token en la BD
            user.setCurrentToken(token);
            userRepository.save(user);
            
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Error crítico al intentar firmar el token JWT", e);
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User registerUser(User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            // Nota: KrakenD es sensible a mayúsculas/minúsculas. 
            // Si aquí guardas "USER", en KrakenD pon "USER" en la lista de roles permitidos.
            user.setRole("USER"); 
        }
        return userRepository.save(user);
    }

    public User login(String identifier, String password) {
        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByName(identifier))
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
        
        // Si el usuario existe, generar y guardar el token
        if (user != null) {
            generateToken(user);
        }
        
        return user;
    }

    public User updateProfile(Long id, User data) {
        return userRepository.findById(id).map(existingUser -> {
            if (data.getName() != null) existingUser.setName(data.getName());
            if (data.getEmail() != null) existingUser.setEmail(data.getEmail());
            if (data.getRole() != null) existingUser.setRole(data.getRole());
            if (data.getAvatarUrl() != null) existingUser.setAvatarUrl(data.getAvatarUrl());
            if (data.getBannerUrl() != null) existingUser.setBannerUrl(data.getBannerUrl());
            if (data.getBio() != null) existingUser.setBio(data.getBio());
            if (data.getBackgroundUrl() != null) existingUser.setBackgroundUrl(data.getBackgroundUrl());
            
            return userRepository.save(existingUser);
        }).orElse(null);
    }

    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!user.getPassword().equals(currentPassword)) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Realiza logout: limpia el token almacenado en la BD
     */
    public boolean logout(Long userId) {
        return userRepository.findById(userId).map(user -> {
            user.setCurrentToken(null);
            userRepository.save(user);
            return true;
        }).orElse(false);
    }
}