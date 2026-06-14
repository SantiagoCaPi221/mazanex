package com.mazanex.publications.config;

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
        
        // 🕵️‍♂️ EL CHIVATO DEFINITIVO EN JAVA
        System.out.println("====== NUEVA PETICIÓN ======");
        System.out.println("Ruta: " + request.getRequestURI());
        System.out.println("Header recibido en Java: " + authHeader);

        final String jwt;
        final String username;

        // 1. Validar que exista y empiece con bearer (ignorando mayúsculas/minúsculas)
        if (authHeader == null || !authHeader.toLowerCase().startsWith("bearer ") || authHeader.contains("null") || authHeader.contains("undefined")) {
            System.out.println("⚠️ Filtro ignorado: Header nulo o formato incorrecto.");
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extraemos el token (siempre son 7 caracteres: "Bearer " o "bearer ")
        jwt = authHeader.substring(7);

        try {
            username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        new ArrayList<>() 
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                System.out.println("✅ TOKEN ACEPTADO para el usuario: " + username);
            }
        } catch (Exception e) {
            System.err.println("❌ ERROR AL VALIDAR TOKEN EN MICROSERVICIO: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}