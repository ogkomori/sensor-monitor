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
  minTemperature?: number;
  maxTemperature?: number;
  avgHumidity?: number;
  minHumidity?: number;
  maxHumidity?: number;
  count: number;
}