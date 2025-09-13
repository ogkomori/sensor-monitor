package com.komori.sensormonitor.config;

import com.komori.sensormonitor.sensor.Sensor;

import java.util.List;

public class SensorConfig {
    public static List<Sensor> getSensors() {
        return List.of(
                new Sensor("sensor_01", "Office", 20.0, 60),
                new Sensor("sensor_02", "Warehouse", 22.0, 55),
                new Sensor("sensor_03", "Server Room", 25.0, 45)
        );
    }
}
