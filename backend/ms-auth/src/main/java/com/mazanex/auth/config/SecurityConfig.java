package com.mazanex.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final RequestIdFilter requestIdFilter;


    // Inyectamos el filtro que creamos
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, RequestIdFilter requestIdFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.requestIdFilter = requestIdFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 1. Activamos CORS
            .csrf(csrf -> csrf.disable()) // Desactivamos CSRF (estándar en APIs con JWT)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT es stateless
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**").permitAll()
                // 2. Permitimos las peticiones pre-flight de CORS (fundamentales para el navegador)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // 3. Abrimos las puertas explícitamente para registro y login (con y sin /api)
                .requestMatchers("/auth/register", 
                "/auth/login", 
                "/api/auth/register", 
                "/api/auth/login",
                "/api/auth/test-glitchtip/**"
            ).permitAll()
                
                // 🔥 RUTAS DE SWAGGER LIBERADAS 🔥
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                
                // 4. Todo el resto de la aplicación requiere token
                .anyRequest().authenticated()
            )
            // 1. El filtro del Request-Id se ejecuta en el umbral de entrada (antes de cualquier validación)
            .addFilterBefore(requestIdFilter, UsernamePasswordAuthenticationFilter.class)
            
            // 2. El filtro JWT se registra usando el de Request-Id como punto de referencia explícito
            .addFilterAfter(jwtAuthFilter, RequestIdFilter.class);

        return http.build();
    }

    // Configuración global de CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Permite cualquier origen
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 1: Añadimos "X-Request-Id" a las cabeceras permitidas para que tu Front u otros MS puedan enviarlo
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Request-Id"));

        // 2: Exponemos la cabecera para que el cliente pueda leer el Request-Id de respuesta
        configuration.setExposedHeaders(Arrays.asList("X-Request-Id"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}