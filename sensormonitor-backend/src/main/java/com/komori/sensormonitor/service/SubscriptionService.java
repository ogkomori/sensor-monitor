package com.komori.sensormonitor.service;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Sinks;

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
        aggregateSink.tryEmitNext(aggregateData);
    }

    public void pushAlert(EnrichedSensorReading reading) {
        alertSink.tryEmitNext(reading);
    }
}
