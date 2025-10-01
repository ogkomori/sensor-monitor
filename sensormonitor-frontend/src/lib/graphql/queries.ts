import { gql } from '@apollo/client';

export const GET_LATEST_READINGS = gql`
  query GetLatestReadings($sensorId: ID!, $limit: Int = 5) {
    latestReadings(sensorId: $sensorId, limit: $limit) {
      sensorId
      location
      temperature
      humidity
      timestamp
      heatIndex
      status
      message
    }
  }
`;

export const GET_AGGREGATE_STATS = gql`
  query GetAggregateStats($sensorId: ID!) {
    aggregateStats(sensorId: $sensorId) {
      sensorId
      avgTemperature
      minTemperature
      maxTemperature
      avgHumidity
      minHumidity
      maxHumidity
      count
    }
  }
`;

export const GET_LAST_ALERTS = gql`
  query GetLastAlerts($sensorId: ID!, $limit: Int = 5) {
    lastAlerts(sensorId: $sensorId, limit: $limit) {
      sensorId
      location
      temperature
      humidity
      timestamp
      heatIndex
      status
      message
    }
  }
`;