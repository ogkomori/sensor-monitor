package com.komori.sensormonitor.service;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class QueryService {
    private final RedisTemplate<String, Object> redisTemplate;

    public List<EnrichedSensorReading> getLatestReadings(String sensorId, int limit) {
        return Objects.requireNonNull(redisTemplate.opsForList()
                        .range("sensor:" + sensorId + ":latest", 0, limit - 1))
                .stream()
                .map(object -> (EnrichedSensorReading) object)
                .toList();
    }

    public AggregateData getAggregateStats(String sensorId) {
        return (AggregateData) redisTemplate.opsForValue()
                .get("sensor:" + sensorId + ":aggregate");
    }

    public List<EnrichedSensorReading> getLastAlerts(String sensorId, int limit) {
        return Objects.requireNonNull(redisTemplate.opsForList()
                        .range("alerts:" + sensorId, 0, limit - 1))
                .stream()
                .map(object -> (EnrichedSensorReading) object)
                .toList();
    }
}
