package com.mazanex.auth.security;

import com.mazanex.auth.model.User;
import com.mazanex.auth.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;
import java.nio.charset.StandardCharsets;
import org.springframework.core.io.ClassPathResource;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    public JwtAuthenticationFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Carga la clave pública desde src/main/resources/public.pem
     */
    private PublicKey loadPublicKey() throws Exception {
        String key = new String(new ClassPathResource("public.pem").getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        
        String publicKeyPEM = key
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replaceAll(System.lineSeparator(), "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");

        byte[] encoded = Base64.getDecoder().decode(publicKeyPEM);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePublic(keySpec);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            // Validar la firma del token con la clave pública
            PublicKey publicKey = loadPublicKey();
            Claims claims = Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String userId = claims.getSubject();
            
            // Buscar al usuario en la BD
            Long userIdLong = Long.parseLong(userId);
            User user = userRepository.findById(userIdLong).orElse(null);

            // Si el usuario no existe o no tiene token guardado, rechazar
            if (user == null || user.getCurrentToken() == null) {
                filterChain.doFilter(request, response);
                return;
            }

            // Validar que el token coincida con el almacenado en la BD
            if (!user.getCurrentToken().equals(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            // Token válido y coincide con BD -> establecer autenticación
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of()
                    );

            auth.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // Si hay error al procesar el token, continuar sin autenticación
            filterChain.doFilter(request, response);
        }
    }
}
