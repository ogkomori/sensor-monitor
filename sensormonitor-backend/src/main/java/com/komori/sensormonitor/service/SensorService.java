package com.komori.sensormonitor.service;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SensorService {
    private final RedisTemplate<Object, Object> redisTemplate;

    public EnrichedSensorReading getLatestReading(String sensorId) {
        return (EnrichedSensorReading) redisTemplate.opsForValue()
                .get("sensor:" + sensorId + ":latest");
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
