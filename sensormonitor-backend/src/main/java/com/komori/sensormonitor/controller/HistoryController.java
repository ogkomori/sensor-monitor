package com.komori.sensormonitor.controller;

import com.komori.sensormonitor.repository.ReadingRepository;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import com.komori.sensormonitor.sensor.SensorReadingEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/history")
@RequiredArgsConstructor
public class HistoryController {
    private final ReadingRepository readingRepository;

    @GetMapping("/{sensorId}")
    public ResponseEntity<List<EnrichedSensorReading>> getSensorHistory(@PathVariable String sensorId) {
        List<SensorReadingEntity> readings = readingRepository.findAllBySensorId(sensorId);
        return ResponseEntity.ok(readings.stream().map(EnrichedSensorReading::new).toList());
    }

}
