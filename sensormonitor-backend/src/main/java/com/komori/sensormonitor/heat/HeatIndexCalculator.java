package com.komori.sensormonitor.heat;

public class HeatIndexCalculator {
    public static double getHeatIndex(double temperature, int humidity) {
        double fahrenheitTemp = (temperature * 9/5) + 32;
        double index = -42.379
        + (2.04901523 * fahrenheitTemp)
        + (10.14333127 * humidity)
        - (0.22475541 * fahrenheitTemp * humidity)
        - (6.83783e-3 * fahrenheitTemp * fahrenheitTemp)
        - (5.481717e-2 * humidity * humidity)
        + (1.22874e-3 * fahrenheitTemp * fahrenheitTemp * humidity)
        + (8.5282e-4 * fahrenheitTemp * humidity * humidity)
        - (1.99e-6 * fahrenheitTemp * fahrenheitTemp * humidity * humidity);
        double celsiusIndex = (index - 32) * 5/9;
        return Math.round(celsiusIndex * 100.0) / 100.0;
    }

    public static HeatIndexWarning getWarning(double heatIndex) {
        if (heatIndex < 27) {
            return HeatIndexWarnings.OK;
        } else if (heatIndex <= 32) {
            return HeatIndexWarnings.CAUTION;
        } else if (heatIndex <= 41) {
            return HeatIndexWarnings.EXTREME_CAUTION;
        } else if (heatIndex <= 54) {
            return HeatIndexWarnings.DANGER;
        } else {
            return HeatIndexWarnings.EXTREME_DANGER;
        }
    }
}
