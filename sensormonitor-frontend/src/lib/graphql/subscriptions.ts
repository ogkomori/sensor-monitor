import { gql } from '@apollo/client';

export const ALERT_STREAM = gql`
  subscription AlertStream($sensorId: ID!) {
    alertStream(sensorId: $sensorId) {
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

export const AGGREGATE_STREAM = gql`
  subscription AggregateStream($sensorId: ID!) {
    aggregateStream(sensorId: $sensorId) {
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

export const LATEST_READING_STREAM = gql`
  subscription LatestReadingStream($sensorId: ID!) {
    latestReadingStream(sensorId: $sensorId) {
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