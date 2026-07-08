package com.mazanex.ranking.config;

import io.sentry.Sentry;
import io.sentry.SentryLevel;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Component
public class GlitchTipErrorReporter {

    private static final String MDC_KEY = "requestId";

    /**
     * Captura una excepción y la envía a GlitchTip indexando el requestId actual.
     */
    public void captureException(Throwable throwable) {
        String requestId = MDC.get(MDC_KEY);
        Sentry.withScope(scope -> {
            if (requestId != null) {
                scope.setTag("request_id", requestId);
            }
            Sentry.captureException(throwable);
        });
    }

    /**
     * Captura una excepción agregando un mensaje de contexto personalizado.
     */
    public void captureException(Throwable throwable, String customContext) {
        String requestId = MDC.get(MDC_KEY);
        Sentry.withScope(scope -> {
            if (requestId != null) {
                scope.setTag("request_id", requestId);
            }
            scope.setExtra("Contexto Adicional", customContext);
            Sentry.captureException(throwable);
        });
    }

    /**
     * Envía un mensaje directo de advertencia o notificación sin necesidad de lanzar un error (Logs/Issues).
     */
    public void captureMessage(String message, SentryLevel level) {
        String requestId = MDC.get(MDC_KEY);
        Sentry.withScope(scope -> {
            if (requestId != null) {
                scope.setTag("request_id", requestId);
            }
            scope.setLevel(level);
            Sentry.captureMessage(message);
        });
    }
}