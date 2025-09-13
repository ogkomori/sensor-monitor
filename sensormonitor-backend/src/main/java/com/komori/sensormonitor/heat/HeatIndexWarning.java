package com.komori.sensormonitor.heat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HeatIndexWarning {
    private String status;
    private String message;
}
