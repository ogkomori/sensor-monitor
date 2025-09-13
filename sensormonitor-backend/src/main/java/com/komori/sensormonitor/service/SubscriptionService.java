package com.komori.sensormonitor.service;

import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Sinks;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final Sinks.Many<EnrichedSensorReading> alertSink;
    private final Sinks.Many<EnrichedSensorReading> latestSink;

    public void pushAlert(EnrichedSensorReading reading) {
        alertSink.tryEmitNext(reading);
    }

    public void pushLatestReading(EnrichedSensorReading reading) {
        latestSink.tryEmitNext(reading);
    }
}
