package com.komori.sensormonitor.consumer;

import com.komori.sensormonitor.config.KafkaTopics;
import com.komori.sensormonitor.sensor.SensorReading;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EventConsumer {
    @KafkaListener(topics = KafkaTopics.RAW, groupId = "${spring.kafka.consumer.group-id}")
    public void consumeRaw(SensorReading reading) {
        log.info(reading.toFancyString());
    }
}
