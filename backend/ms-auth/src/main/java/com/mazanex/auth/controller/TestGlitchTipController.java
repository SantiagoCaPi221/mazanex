package com.mazanex.auth.controller;

import com.mazanex.auth.config.GlitchTipErrorReporter;
import io.sentry.SentryLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/test-glitchtip")
public class TestGlitchTipController {

    private static final Logger logger = LoggerFactory.getLogger(TestGlitchTipController.class);
    private final GlitchTipErrorReporter errorReporter;

    public TestGlitchTipController(GlitchTipErrorReporter errorReporter) {
        this.errorReporter = errorReporter;
    }

    // 1. Probar envío de Logs ordinarios
    @GetMapping("/log")
    public String testLog() {
        logger.info("Verificación de logs ordinarios: Este mensaje debería aparecer en GlitchTip Logs.");
        return "Log enviado correctamente a la cola.";
    }

    // 2. Probar envío de advertencia explícita (Message)
    @GetMapping("/message")
    public String testMessage() {
        errorReporter.captureMessage("Alerta manual: Intento sospechoso detectado en ms-auth", SentryLevel.WARNING);
        return "Mensaje de advertencia reportado.";
    }

    // 3. Probar captura de excepciones inesperadas (Genera un Issue)
    @GetMapping("/error")
    public String testError() {
        throw new RuntimeException("Simulación de fallo crítico en el servicio de autenticación.");
    }
}