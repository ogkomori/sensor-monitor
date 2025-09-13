package com.komori.sensormonitor.sensor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AggregateData {
    private String sensorId;
    private double avgTemperature;
    private double avgHumidity;
    private int count;
    private String windowStart;
    private String windowEnd;
}
