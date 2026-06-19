package com.mazanex.profile.util;

import java.time.Instant;
import java.util.concurrent.Callable;
import java.util.concurrent.atomic.AtomicInteger;

public class SimpleCircuitBreaker {

    private enum State { CLOSED, OPEN, HALF_OPEN }

    private final int failureThreshold;
    private final int permittedCallsInHalfOpen;
    private final long openStateMillis;

    private final AtomicInteger failureCount = new AtomicInteger();
    private final AtomicInteger successCount = new AtomicInteger();
    private volatile State state = State.CLOSED;
    private volatile long openTimestamp = 0;

    public SimpleCircuitBreaker(int failureThreshold, int permittedCallsInHalfOpen, long openStateMillis) {
        this.failureThreshold = failureThreshold;
        this.permittedCallsInHalfOpen = permittedCallsInHalfOpen;
        this.openStateMillis = openStateMillis;
    }

    public synchronized <T> T execute(Callable<T> action) throws Exception {
        if (state == State.OPEN) {
            if (Instant.now().toEpochMilli() - openTimestamp > openStateMillis) {
                state = State.HALF_OPEN;
                failureCount.set(0);
                successCount.set(0);
            } else {
                throw new IllegalStateException("Circuit breaker is open");
            }
        }

        try {
            T result = action.call();
            recordSuccess();
            return result;
        } catch (Exception ex) {
            recordFailure();
            throw ex;
        }
    }

    private void recordSuccess() {
        if (state == State.HALF_OPEN) {
            successCount.incrementAndGet();
            if (successCount.get() >= permittedCallsInHalfOpen) {
                state = State.CLOSED;
                failureCount.set(0);
            }
        }
    }

    private void recordFailure() {
        int failures = failureCount.incrementAndGet();
        if (state == State.HALF_OPEN || failures >= failureThreshold) {
            state = State.OPEN;
            openTimestamp = Instant.now().toEpochMilli();
        }
    }
}