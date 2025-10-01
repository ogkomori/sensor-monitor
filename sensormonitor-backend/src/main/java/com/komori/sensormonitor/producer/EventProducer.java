package com.komori.sensormonitor.producer;

import com.komori.sensormonitor.config.KafkaTopics;
import com.komori.sensormonitor.sensor.SensorList;
import com.komori.sensormonitor.sensor.Sensor;
import com.komori.sensormonitor.sensor.SensorReading;
import com.komori.sensormonitor.config.TimeSimulator;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventProducer {
    private final KafkaTemplate<String, SensorReading> kafkaTemplate;
    private final SensorReadingGenerator sensorReadingGenerator;

    public void produceRawReadings() {
        for (Sensor sensor : SensorList.getSensors()) {
            SensorReading reading = sensorReadingGenerator.generateReading(sensor);
            kafkaTemplate.send(KafkaTopics.RAW, reading.getSensorId(), reading);
        }

        // Simulate an hour passing
        TimeSimulator.time = TimeSimulator.time.plusHours(1);
    }
}
