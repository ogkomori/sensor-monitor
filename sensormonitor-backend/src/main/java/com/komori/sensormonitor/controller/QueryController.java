package com.komori.sensormonitor.controller;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import com.komori.sensormonitor.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class QueryController {
    private final SensorService sensorService;

    @QueryMapping
    public EnrichedSensorReading latestReading(@Argument String sensorId) {
        return sensorService.getLatestReading(sensorId);
    }

    @QueryMapping
    public AggregateData aggregateStats(@Argument String sensorId) {
        return sensorService.getAggregateStats(sensorId);
    }

    @QueryMapping
    public List<EnrichedSensorReading> lastAlerts(@Argument String sensorId, @Argument int limit) {
        return sensorService.getLastAlerts(sensorId, limit);
    }
}
