package com.komori.sensormonitor.producer;

import com.komori.sensormonitor.config.TimeSimulator;
import com.komori.sensormonitor.sensor.Sensor;
import com.komori.sensormonitor.sensor.SensorReading;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class SensorReadingGenerator {
    private static final Random random = new Random();

    private static double dailyPatternTemperature(int hour) {
        // Using a sine function to simulate warmer days and cooler nights
        // with an amplitude of 5°C
        return 5 * Math.sin(hour*2*Math.PI / 24);
    }

    public SensorReading generateReading(Sensor sensor) {
        // Change drift gradually each hour for each sensor
        double driftChange = (random.nextInt(3) - 1) * 0.1; // One of {-0.1, 0.0, 0.1}
        sensor.setDrift(sensor.getDrift() + driftChange);

        // Daily Temp Pattern
        double dailyPatternTemp = dailyPatternTemperature(TimeSimulator.time.getHour());

        // Random Noise for Temperature in [-0.5,0.5]
        double tempNoise = (random.nextInt(0, 11) * 0.1) - 0.5;

        // Final Temp calculation
        double temperature = sensor.getBaseTemp() + sensor.getDrift() + dailyPatternTemp + tempNoise;
        temperature = Math.round(temperature * 10.0) / 10.0; // round to 1dp

        // Random Noise for Humidity in [-1,1]
        double humidNoise = random.nextInt(3) - 1;

        // Let Humidity be loosely inversely correlated to Temperature
        double tempChange = temperature - sensor.getBaseTemp();
        double correlationChange = -tempChange * 0.4;

        // Final Humidity calculation
        int humidity = (int) (sensor.getBaseHumidity() + (10 * sensor.getDrift()) + correlationChange + humidNoise);
        humidity = Math.max(0, Math.min(100, humidity)); // to ensure humidity is always between 0 and 100

        return SensorReading.builder()
                .sensorId(sensor.getSensorId())
                .location(sensor.getLocation())
                .temperature(temperature)
                .humidity(humidity)
                .timestamp(TimeSimulator.time)
                .build();
    }
}
