package com.komori.sensormonitor.sensor;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Random;

@Data
@NoArgsConstructor
public class Sensor {
    private String sensorId;
    private String location;
    private double baseTemp;
    private int baseHumidity;
    private double drift;

    public Sensor(String sensorId, String location, double baseTemp, int baseHumidity) {
        Random random = new Random();
        this.sensorId = sensorId;
        this.location = location;
        this.baseTemp = baseTemp;
        this.baseHumidity = baseHumidity;
        this.drift = (random.nextInt(0, 11) * 0.1) - 0.5; // random 1dp number in [-0.5,0.5]
    }
}
