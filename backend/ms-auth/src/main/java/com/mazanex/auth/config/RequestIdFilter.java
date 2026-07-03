package com.mazanex.auth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class RequestIdFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID_HEADER = "X-Request-Id";
    private static final String MDC_KEY = "requestId";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 1. Intentar obtener el ID desde los headers (por si viene de un API Gateway)
        String requestId = request.getHeader(REQUEST_ID_HEADER);
        
        // 2. Si no viene, generamos un UUID nuevo
        if (requestId == null || requestId.isBlank()) {
            requestId = UUID.randomUUID().toString();
        }

        // 3. Registrar el ID en el MDC para que Logback y Sentry/GlitchTip lo hereden automáticamente
        MDC.put(MDC_KEY, requestId);
        
        // 4. Devolverlo en la respuesta HTTP para trazabilidad del cliente
        response.setHeader(REQUEST_ID_HEADER, requestId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            // 5. Muy importante: Limpiar el MDC al terminar el ciclo del hilo
            MDC.remove(MDC_KEY);
        }
    }
}