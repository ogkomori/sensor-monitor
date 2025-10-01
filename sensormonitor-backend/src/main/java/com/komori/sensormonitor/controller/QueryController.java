package com.komori.sensormonitor.controller;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import com.komori.sensormonitor.service.QueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class QueryController {
    private final QueryService queryService;

    @QueryMapping
    public List<EnrichedSensorReading> latestReadings(@Argument String sensorId, @Argument int limit) {
        return queryService.getLatestReadings(sensorId, limit);
    }

    @QueryMapping
    public AggregateData aggregateStats(@Argument String sensorId) {
        return queryService.getAggregateStats(sensorId);
    }

    @QueryMapping
    public List<EnrichedSensorReading> lastAlerts(@Argument String sensorId, @Argument int limit) {
        return queryService.getLastAlerts(sensorId, limit);
    }
}
