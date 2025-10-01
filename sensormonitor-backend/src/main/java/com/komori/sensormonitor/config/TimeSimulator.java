package com.komori.sensormonitor.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class TimeSimulator {
    public static LocalDateTime time = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
}
