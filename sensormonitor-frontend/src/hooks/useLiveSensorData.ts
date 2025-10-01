import { useQuery, useSubscription } from "@apollo/client/react/hooks";
import { GET_LATEST_READINGS, GET_AGGREGATE_STATS } from "@/lib/graphql/queries";
import { LATEST_READING_STREAM, AGGREGATE_STREAM } from "@/lib/graphql/subscriptions";
import { useEffect, useState } from "react";

export function useLiveSensorData(sensorId?: string) {

  // Queries for initial snapshot
  const { data: latestReadingsData, loading: latestLoading } = useQuery(GET_LATEST_READINGS, {
    variables: { sensorId, limit: 5 },
    skip: !sensorId,
    fetchPolicy: "no-cache",
  });

  const { data: aggregateData, loading: aggregateLoading } = useQuery(GET_AGGREGATE_STATS, {
    variables: { sensorId },
    skip: !sensorId,
    fetchPolicy: "no-cache",
  });

  // Local state for live data
  const [latestReadings, setLatestReadings] = useState<any[]>([]);
  const [aggregateStats, setAggregateStats] = useState<any | null>(null);

  // Initialize state from queries when sensorId changes
  useEffect(() => {
    if (latestReadingsData?.latestReadings) {
      setLatestReadings(latestReadingsData.latestReadings);
    }
  }, [sensorId, latestReadingsData?.latestReadings]);

  useEffect(() => {
    if (aggregateData?.aggregateStats) {
      setAggregateStats(aggregateData.aggregateStats);
    }
  }, [sensorId, aggregateData?.aggregateStats]);

  // Subscriptions for live updates
  useSubscription(LATEST_READING_STREAM, {
    variables: { sensorId },
    skip: !sensorId,
    onData: ({ data }) => {
      const newReading = data?.data?.latestReadingStream;
      if (newReading) {
        setLatestReadings(prev => [newReading, ...prev].slice(0, 5));
        console.log('[LiveSensor] New reading received:', newReading); // Debugging aid
      }
    },
  });

  useSubscription(AGGREGATE_STREAM, {
    variables: { sensorId },
    skip: !sensorId,
    onData: ({ data }) => {
      const newAggregate = data?.data?.aggregateStream;
      if (newAggregate) {
        setAggregateStats(newAggregate);
        console.log('[LiveSensor] New aggregate received:', newAggregate); // Debugging aid
      }
    },
  });

  // Loading state
  const isLoading = latestLoading || aggregateLoading;

  return {
    latestReadings,
    aggregateStats,
    isLoading,
  };
}
