import { useState, useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react/hooks';
import { SensorSelector } from './SensorSelector';
import { MetricsCards } from './MetricsCards';
import { LiveChart } from './LiveChart';
import { AlertsPanel } from './AlertsPanel';
import { GET_LATEST_READING, GET_AGGREGATE_STATS, GET_LAST_ALERTS } from '@/lib/graphql/queries';
import { ALERT_STREAM, LATEST_READING_STREAM } from '@/lib/graphql/subscriptions';
import { EnrichedSensorReading, AggregateData } from '@/lib/graphql/types';
import { toast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const SensorDashboard = () => {
  const [selectedSensorId, setSelectedSensorId] = useState<string>('');
  const [liveReading, setLiveReading] = useState<EnrichedSensorReading | undefined>();
  const [newAlert, setNewAlert] = useState<EnrichedSensorReading | undefined>();

  // Queries - only run when sensor is selected
  const { 
    data: latestReadingData, 
    loading: latestReadingLoading, 
    error: latestReadingError 
  } = useQuery(GET_LATEST_READING, {
    variables: { sensorId: selectedSensorId },
    skip: !selectedSensorId,
    pollInterval: 10000, // Fallback polling every 10 seconds
  });

  const { 
    data: aggregateData, 
    loading: aggregateLoading, 
    error: aggregateError 
  } = useQuery(GET_AGGREGATE_STATS, {
    variables: { sensorId: selectedSensorId },
    skip: !selectedSensorId,
  });

  const { 
    data: alertsData, 
    loading: alertsLoading, 
    error: alertsError 
  } = useQuery(GET_LAST_ALERTS, {
    variables: { sensorId: selectedSensorId, limit: 10 },
    skip: !selectedSensorId,
  });

  // Subscriptions - only run when sensor is selected
  const { data: liveReadingData, error: liveReadingSubError } = useSubscription(LATEST_READING_STREAM, {
    variables: { sensorId: selectedSensorId },
    skip: !selectedSensorId,
    onData: ({ data }) => {
      if (data?.data?.latestReadingStream) {
        setLiveReading(data.data.latestReadingStream);
      }
    },
    onError: (error) => {
      console.error('Live reading subscription error:', error);
      toast({
        title: 'Connection Issue',
        description: 'Lost connection to live readings. Trying to reconnect...',
        variant: 'destructive',
      });
    },
  });

  const { data: alertStreamData, error: alertSubError } = useSubscription(ALERT_STREAM, {
    variables: { sensorId: selectedSensorId },
    skip: !selectedSensorId,
    onData: ({ data }) => {
      if (data?.data?.alertStream) {
        const alert = data.data.alertStream;
        setNewAlert(alert);
        
        // Show toast notification for critical alerts
        if (alert.status === 'CRITICAL') {
          toast({
            title: `Critical Alert: ${alert.sensorId}`,
            description: alert.message || 'Sensor is in critical condition',
            variant: 'destructive',
          });
        } else if (alert.status === 'WARNING') {
          toast({
            title: `Warning: ${alert.sensorId}`,
            description: alert.message || 'Sensor requires attention',
            variant: 'default',
          });
        }
      }
    },
    onError: (error) => {
      console.error('Alert subscription error:', error);
    },
  });

  // Reset live data when sensor changes
  useEffect(() => {
    if (selectedSensorId) {
      setLiveReading(undefined);
      setNewAlert(undefined);
      
      toast({
        title: 'Sensor Connected',
        description: `Now monitoring ${selectedSensorId}`,
      });
    }
  }, [selectedSensorId]);

  const handleSensorSelect = (sensorId: string) => {
    setSelectedSensorId(sensorId);
  };

  const hasErrors = latestReadingError || aggregateError || alertsError || liveReadingSubError || alertSubError;
  const isLoading = latestReadingLoading || aggregateLoading || alertsLoading;

  // Use live reading if available, otherwise fall back to latest reading from query
  const displayReading = liveReading || latestReadingData?.latestReading;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">IoT Sensor Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and alerts for your sensor network
          </p>
        </div>

        {/* Connection Status */}
        {hasErrors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connection issues detected. Some features may not work properly. 
              Please check your GraphQL backend is running on localhost:8080.
            </AlertDescription>
          </Alert>
        )}

        {/* Sensor Selection */}
        <div className="max-w-lg mx-auto">
          <SensorSelector 
            onSensorSelect={handleSensorSelect} 
            currentSensorId={selectedSensorId}
          />
        </div>

        {selectedSensorId && (
          <>
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading sensor data...</span>
              </div>
            )}

            {/* Metrics Cards */}
            <MetricsCards
              latestReading={displayReading}
              aggregateData={aggregateData?.aggregateStats}
              loading={isLoading}
            />

            {/* Live Chart and Alerts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LiveChart
                  latestReading={displayReading}
                  sensorId={selectedSensorId}
                />
              </div>
              <div className="lg:col-span-1">
                <AlertsPanel
                  alerts={alertsData?.lastAlerts || []}
                  newAlert={newAlert}
                  loading={alertsLoading}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};