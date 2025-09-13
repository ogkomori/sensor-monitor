package com.komori.sensormonitor.config;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TimeSimulator {
    public static LocalDateTime time =  LocalDateTime.of(2025, 9, 6, 0, 0);
}
