package com.komori.sensormonitor.config;

import com.komori.sensormonitor.sensor.SensorReading;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;

@Configuration
public class KafkaConfig {
    @Bean
    public KafkaTemplate<String, SensorReading> kafkaTemplate(DefaultKafkaProducerFactory<String, SensorReading> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }
}
