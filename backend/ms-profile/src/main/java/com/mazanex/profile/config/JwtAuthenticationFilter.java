package com.mazanex.profile.config; 

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.ArrayList;

/**
 * Filtro de seguridad que valida los tokens JWT entrantes en las solicitudes del microservicio de perfiles.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // 1. Validar que el header exista y sea Bearer
        if (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.equals("Bearer null") || authHeader.equals("Bearer undefined")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            // 2. Extraer el usuario (Esta línea valida la firma criptográfica internamente)
            username = jwtService.extractUsername(jwt);

            // 3. Si es válido y no está autenticado, lo dejamos pasar sin preguntar a la BD
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        new ArrayList<>() // Confía ciegamente en el token
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                // MENSAJE DE ÉXITO
                System.out.println("✅ TOKEN ACEPTADO para el usuario: " + username);
            }
        } catch (Exception e) {
            // SI ALGO FALLA (Firma inválida, llave distinta, etc), LO IMPRIMIRÁ AQUÍ
            System.err.println("❌ ERROR AL VALIDAR TOKEN EN MICROSERVICIO: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}