package com.mazanex.profile.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

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

        // 1. Validar que el header exista, sea Bearer y no venga corrupto desde el front
        if (authHeader == null || !authHeader.startsWith("Bearer ") || 
            authHeader.equals("Bearer null") || authHeader.equals("Bearer undefined")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            // 2. Extraer el usuario (Esta línea valida la firma criptográfica internamente)
            username = jwtService.extractUsername(jwt);

            // 3. Si es válido y no está autenticado en el contexto actual de la petición
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // SOLUCIÓN AL 403: Asignamos al menos una autoridad estándar (ROLE_USER).
                // Spring Security rechaza mutaciones (PUT/POST) si la lista de roles es totalmente vacía.
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        authorities
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // Guardamos la autenticación en el contexto de Spring
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                // Mensaje de control en tu terminal
                System.out.println("✅ [JwtFilter] TOKEN ACEPTADO para: " + username + " | Roles: " + authorities);
            }
        } catch (Exception e) {
            // Si la firma no coincide o el token expiró, saltará aquí
            System.err.println("❌ [JwtFilter] ERROR AL VALIDAR TOKEN EN MICROSERVICIO: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}