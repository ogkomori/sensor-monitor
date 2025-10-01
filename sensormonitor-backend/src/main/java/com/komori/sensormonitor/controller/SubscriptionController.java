package com.komori.sensormonitor.controller;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import lombok.RequiredArgsConstructor;
import org.reactivestreams.Publisher;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.SubscriptionMapping;
import org.springframework.stereotype.Controller;
import reactor.core.publisher.Sinks;

@Controller
@RequiredArgsConstructor
public class SubscriptionController {
    private final Sinks.Many<EnrichedSensorReading> alertSink;
    private final Sinks.Many<AggregateData> aggregateSink;
    private final Sinks.Many<EnrichedSensorReading> latestSink;

    @SubscriptionMapping
    public Publisher<EnrichedSensorReading> alertStream(@Argument String sensorId) {
        return alertSink.asFlux().filter(reading -> reading.getSensorId().equals(sensorId));
    }

    @SubscriptionMapping
    public Publisher<AggregateData> aggregateStream(@Argument String sensorId) {
        return aggregateSink.asFlux().filter(aggregateData -> aggregateData.getSensorId().equals(sensorId));
    }

    @SubscriptionMapping
    public Publisher<EnrichedSensorReading> latestReadingStream(@Argument String sensorId) {
        return latestSink.asFlux().filter(reading -> reading.getSensorId().equals(sensorId));
    }
}
