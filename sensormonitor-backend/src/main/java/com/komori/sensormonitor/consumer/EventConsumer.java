package com.komori.sensormonitor.consumer;

import com.komori.sensormonitor.config.KafkaTopics;
import com.komori.sensormonitor.repository.ReadingRepository;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import com.komori.sensormonitor.sensor.SensorReadingEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EventConsumer {
    private final ReadingRepository readingRepository;

    @KafkaListener(topics = KafkaTopics.ENRICHED, groupId = "${spring.kafka.consumer.group-id}")
    public void consumeRaw(EnrichedSensorReading reading) {
        readingRepository.save(new SensorReadingEntity(reading));
    }
}
