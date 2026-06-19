package com.mazanex.publications.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class CircuitBreakerConfiguration {

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry(
            @Value("${DEPLOY_ENV:local}") String deployEnv,
            @Value("${CB_FAILURE_RATE:0}") float failureRateThreshold,
            @Value("${CB_SLIDING_WINDOW_SIZE:0}") int slidingWindowSize,
            @Value("${CB_WAIT_DURATION_IN_OPEN_STATE:0}") int waitDurationInOpenState,
            @Value("${CB_PERMITTED_NUMBER_OF_CALLS_IN_HALF_OPEN_STATE:0}") int permittedNumberOfCallsInHalfOpenState,
            @Value("${CB_MINIMUM_NUMBER_OF_CALLS:0}") int minimumNumberOfCalls
    ) {
        boolean railway = "railway".equalsIgnoreCase(deployEnv);
        float failureRate = failureRateThreshold > 0 ? failureRateThreshold : (railway ? 50f : 75f);
        int windowSize = slidingWindowSize > 0 ? slidingWindowSize : (railway ? 20 : 10);
        int waitSeconds = waitDurationInOpenState > 0 ? waitDurationInOpenState : (railway ? 30 : 10);
        int permittedHalfOpen = permittedNumberOfCallsInHalfOpenState > 0 ? permittedNumberOfCallsInHalfOpenState : 2;
        int minimumCalls = minimumNumberOfCalls > 0 ? minimumNumberOfCalls : 5;

        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
                .failureRateThreshold(failureRate)
                .slidingWindowSize(windowSize)
                .minimumNumberOfCalls(minimumCalls)
                .waitDurationInOpenState(Duration.ofSeconds(waitSeconds))
                .permittedNumberOfCallsInHalfOpenState(permittedHalfOpen)
                .recordExceptions(Exception.class)
                .build();

        return CircuitBreakerRegistry.of(config);
    }
}
