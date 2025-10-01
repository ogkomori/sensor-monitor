package com.komori.sensormonitor.config;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Sinks;

@Configuration
public class SubscriptionConfig {
    @Bean
    public Sinks.Many<EnrichedSensorReading> alertSink() {
        return Sinks.many().multicast().onBackpressureBuffer();
    }

    @Bean
    public Sinks.Many<AggregateData> aggregateSink() {
        return Sinks.many().replay().latest();
    }

    @Bean()
    public Sinks.Many<EnrichedSensorReading> latestSink() {
        return Sinks.many().multicast().onBackpressureBuffer();
    }
}
