import { gql } from '@apollo/client';

export const GET_LATEST_READING = gql`
  query GetLatestReading($sensorId: ID!) {
    latestReading(sensorId: $sensorId) {
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
      avgHumidity
      count
      windowStart
      windowEnd
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