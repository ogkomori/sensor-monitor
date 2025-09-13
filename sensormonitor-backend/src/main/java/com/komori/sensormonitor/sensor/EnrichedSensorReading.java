package com.komori.sensormonitor.sensor;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("SensorReading")
public class EnrichedSensorReading {
    @Id
    private String sensorId;
    private String location;
    private double temperature;
    private int humidity;
    private double heatIndex;
    private LocalDateTime timestamp;
    private String status;
    private String message;
}
