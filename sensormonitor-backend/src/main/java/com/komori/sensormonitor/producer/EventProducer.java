package com.komori.sensormonitor.producer;

import com.komori.sensormonitor.config.KafkaTopics;
import com.komori.sensormonitor.config.SensorConfig;
import com.komori.sensormonitor.sensor.Sensor;
import com.komori.sensormonitor.sensor.SensorReading;
import com.komori.sensormonitor.config.TimeSimulator;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventProducer {
    private final KafkaTemplate<String, SensorReading> kafkaTemplate;
    private final SensorReadingGenerator sensorReadingGenerator;

    @Scheduled(fixedRate = 10000) // Every 10 seconds
    public void produceRaw() {
        for (Sensor sensor : SensorConfig.getSensors()) {
            SensorReading reading = sensorReadingGenerator.generateReading(sensor);
            kafkaTemplate.send(KafkaTopics.RAW, reading);
        }

        // Simulate an hour passing
        TimeSimulator.time = TimeSimulator.time.plusHours(1);
    }
}
