package com.komori.sensormonitor.service;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Sinks;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final Sinks.Many<EnrichedSensorReading> latestSink;
    private final Sinks.Many<EnrichedSensorReading> alertSink;
    private final Sinks.Many<AggregateData> aggregateSink;

    public void pushLatestReading(EnrichedSensorReading reading) {
        latestSink.tryEmitNext(reading);
    }

    public void pushAggregateData(AggregateData aggregateData) {
        log.info("Push method called for {}", aggregateData.getSensorId());
        Sinks.EmitResult result = aggregateSink.tryEmitNext(aggregateData);
        log.info("SensorId: {}, Result: {}", aggregateData.getSensorId(), result);
    }

    public void pushAlert(EnrichedSensorReading reading) {
        alertSink.tryEmitNext(reading);
    }
}
