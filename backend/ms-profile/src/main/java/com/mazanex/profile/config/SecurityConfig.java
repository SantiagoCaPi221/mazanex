package com.mazanex.profile.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Habilitar la configuración de CORS definida abajo
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) 
            
            // Deshabilitar CSRF obligatorio para APIs REST con JWT
            .csrf(csrf -> csrf.disable())
            
            // Política de sesión sin estado
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Reglas de autorización de rutas
            .authorizeHttpRequests(auth -> auth
                // Dejar pasar las peticiones preflight del navegador
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                
                // Endpoints públicos explícitos
                .requestMatchers(HttpMethod.GET, "/api/profile/list").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/profile/social/public/**").permitAll()
                
                // Cualquier otra petición (como el PUT /{id}) requerirá token válido
                .anyRequest().authenticated()
            )
            
            // Inyectamos nuestro filtro antes del interceptor básico de Spring
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permite peticiones desde cualquier origen en desarrollo
        configuration.setAllowedOrigins(List.of("*")); 
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}