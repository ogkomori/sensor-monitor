package com.komori.sensormonitor.controller;

import com.komori.sensormonitor.producer.EventProducer;
import com.komori.sensormonitor.repository.ReadingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ScheduledFuture;

@RestController
@RequestMapping("/simulation")
@RequiredArgsConstructor
public class SimulationController {
    private final EventProducer eventProducer;
    private final TaskScheduler taskScheduler;
    private final ReadingRepository readingRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private volatile ScheduledFuture<?> scheduledFuture;
    private volatile boolean started = false;

    @GetMapping("/started")
    public ResponseEntity<Boolean> started() {
        return ResponseEntity.ok(started);
    }

    @PostMapping("/start")
    public ResponseEntity<String> startSimulation() {
        scheduledFuture = taskScheduler.scheduleAtFixedRate(eventProducer::produceRawReadings, Instant.now().plusSeconds(5), Duration.ofSeconds(10));
        started = true;
        return ResponseEntity.ok("Simulation started");
    }

    @PostMapping("/stop")
    public ResponseEntity<String> stopSimulation() {
        scheduledFuture.cancel(false);
        started = false;
        return ResponseEntity.ok("Simulation stopped");
    }

    @DeleteMapping("/clear-data")
    public ResponseEntity<String> clearData() {
        readingRepository.deleteAll();
        redisTemplate.delete(redisTemplate.keys("*"));
        return ResponseEntity.ok("Data cleared");
    }
}
