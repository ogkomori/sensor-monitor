package com.komori.sensormonitor.sensor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SensorReading {
    private String sensorId;
    private String location;
    private double temperature;
    private int humidity;
    private LocalDateTime timestamp;

    public String toFancyString() {
        return String.format("[%s] %s Temp: %.1f°C Humidity: %d%% at %s",
                sensorId, location, temperature, humidity, timestamp);
    }
}
