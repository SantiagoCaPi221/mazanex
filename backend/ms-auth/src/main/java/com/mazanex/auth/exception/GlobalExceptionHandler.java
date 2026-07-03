package com.mazanex.auth.exception;

import com.mazanex.auth.config.GlitchTipErrorReporter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final GlitchTipErrorReporter errorReporter;

    // Inyección por constructor limpia
    public GlobalExceptionHandler(GlitchTipErrorReporter errorReporter) {
        this.errorReporter = errorReporter;
    }

    /**
     * Captura ERRORES CRÍTICOS / INESPERADOS (500 Internal Server Error)
     * Estos van directo a GlitchTip Issues.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        String requestId = MDC.get("requestId");
        
        // Incluimos el requestId en el mensaje de log para facilitar búsquedas por texto libre
        String logMessage = String.format("[requestId=%s] Error inesperado en ms-auth: %s", requestId, ex.getMessage());
        logger.error(logMessage, ex);

        // Enviamos el error a la sección "Issues" de GlitchTip usando nuestro reporter externo
        errorReporter.captureException(ex);

        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un error interno en el sistema de autenticación.", requestId);
    }

    /**
     * Captura EXCEPCIONES DE NEGOCIO (Ejemplo: Credenciales inválidas, tokens incorrectos)
     * Dependiendo de tus clases de excepción, puedes añadir las tuyas aquí (e.g., BadCredentialsException.class)
     */
    @ExceptionHandler(IllegalArgumentException.class) // Cambiar por tu excepción personalizada si aplica
    public ResponseEntity<Map<String, Object>> handleBadRequestExceptions(IllegalArgumentException ex) {
        String requestId = MDC.get("requestId");
        
        // Un log de advertencia ordinario (viajará a GlitchTip Logs gracias a Logback, sin saturar Issues)
        logger.warn("[requestId={}] Intento de solicitud inválido: {}", requestId, ex.getMessage());

        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), requestId);
    }

    /**
     * Estructura auxiliar para homogeneizar las respuestas JSON del API
     */
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message, String requestId) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("requestId", requestId); // El cliente web/móvil recibirá este ID para reportes

        return new ResponseEntity<>(body, status);
    }
}