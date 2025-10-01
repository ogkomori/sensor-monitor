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
    @Builder.Default
    private double avgTemperature = 0;
    @Builder.Default
    private double minTemperature = Double.MAX_VALUE;
    @Builder.Default
    private double maxTemperature = Double.MIN_VALUE;
    @Builder.Default
    private double avgHumidity = 0;
    @Builder.Default
    private double minHumidity = Double.MAX_VALUE;
    @Builder.Default
    private double maxHumidity = Double.MIN_VALUE;
    @Builder.Default
    private int count = 0;
}
