export interface SensorReading {
  sensorId: string;
  location?: string;
  temperature?: number;
  humidity?: number;
  timestamp: string;
}

export interface EnrichedSensorReading extends SensorReading {
  heatIndex?: number;
  status: string;
  message?: string;
}

export interface AggregateData {
  sensorId: string;
  avgTemperature?: number;
  avgHumidity?: number;
  count: number;
  windowStart: string;
  windowEnd: string;
}

export type SensorStatus = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OFFLINE';