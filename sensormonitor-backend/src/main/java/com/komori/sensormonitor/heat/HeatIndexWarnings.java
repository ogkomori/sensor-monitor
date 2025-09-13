package com.komori.sensormonitor.heat;

public class HeatIndexWarnings {
    public static final HeatIndexWarning OK = new HeatIndexWarning("OK", "no warnings at this condition.");
    public static final HeatIndexWarning CAUTION = new HeatIndexWarning("CAUTION", "at this condition, fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps.");
    public static final HeatIndexWarning EXTREME_CAUTION = new HeatIndexWarning("EXTREME CAUTION", "at this condition, heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke.");
    public static final HeatIndexWarning DANGER = new HeatIndexWarning("DANGER", "at this condition, heat cramps and heat exhaustion are likely; heat stroke is probable with continued activity.");
    public static final HeatIndexWarning EXTREME_DANGER = new HeatIndexWarning("EXTREME DANGER", "at this condition, heat stroke is imminent.");
}
