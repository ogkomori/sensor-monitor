package com.komori.sensormonitor.sensor;

import lombok.*;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EnrichedSensorReading {
    private String sensorId;
    private String location;
    private double temperature;
    private int humidity;
    private double heatIndex;
    private Instant timestamp;
    private String status;
    private String message;

    public EnrichedSensorReading(SensorReadingEntity entity) {
        this.sensorId = entity.getSensorId();
        this.location = entity.getLocation();
        this.temperature = entity.getTemperature();
        this.humidity = entity.getHumidity();
        this.heatIndex = entity.getHeatIndex();
        this.timestamp = entity.getTimestamp();
        this.status = entity.getStatus();
        this.message = entity.getMessage();
    }
}
