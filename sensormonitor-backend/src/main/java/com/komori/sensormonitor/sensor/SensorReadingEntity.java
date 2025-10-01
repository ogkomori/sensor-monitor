package com.komori.sensormonitor.sensor;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@SuppressWarnings("JpaDataSourceORMInspection")
@Entity
@Table(name = "readings")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SensorReadingEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String sensorId;
    private String location;
    private Double temperature;
    private Integer humidity;
    private Double heatIndex;
    private Instant timestamp;
    private String status;
    private String message;

    public SensorReadingEntity(EnrichedSensorReading reading) {
        this.sensorId = reading.getSensorId();
        this.location = reading.getLocation();
        this.temperature = reading.getTemperature();
        this.humidity = reading.getHumidity();
        this.heatIndex = reading.getHeatIndex();
        this.timestamp = reading.getTimestamp();
        this.status = reading.getStatus();
        this.message = reading.getMessage();
    }
}
