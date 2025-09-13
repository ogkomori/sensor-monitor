import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Activity, MapPin, Clock } from 'lucide-react';
import { EnrichedSensorReading, AggregateData } from '@/lib/graphql/types';
import { cn } from '@/lib/utils';

interface MetricsCardsProps {
  latestReading?: EnrichedSensorReading;
  aggregateData?: AggregateData;
  loading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'NORMAL':
      return 'bg-success text-success-foreground';
    case 'WARNING':
      return 'bg-warning text-warning-foreground';
    case 'CRITICAL':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};

export const MetricsCards = ({ latestReading, aggregateData, loading }: MetricsCardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!latestReading && !aggregateData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No sensor data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Latest Temperature */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestReading?.temperature?.toFixed(1) || '--'}°C
          </div>
          <p className="text-xs text-muted-foreground">
            Heat Index: {latestReading?.heatIndex?.toFixed(1) || '--'}°C
          </p>
        </CardContent>
      </Card>

      {/* Latest Humidity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Humidity</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestReading?.humidity || '--'}%
          </div>
          <p className="text-xs text-muted-foreground">Relative humidity</p>
        </CardContent>
      </Card>

      {/* Sensor Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge className={cn(getStatusColor(latestReading?.status || 'OFFLINE'))}>
              {latestReading?.status || 'OFFLINE'}
            </Badge>
            {latestReading?.message && (
              <p className="text-xs text-muted-foreground">{latestReading.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location & Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Location</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {latestReading?.location || 'Unknown'}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            {latestReading?.timestamp ? formatTimestamp(latestReading.timestamp) : '--'}
          </div>
        </CardContent>
      </Card>

      {/* Aggregated Data Cards */}
      {aggregateData && (
        <>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Average Metrics</CardTitle>
              <CardDescription>
                Window: {formatTimestamp(aggregateData.windowStart)} - {formatTimestamp(aggregateData.windowEnd)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-lg font-semibold">
                    {aggregateData.avgTemperature?.toFixed(1) || '--'}°C
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Temperature</p>
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {aggregateData.avgHumidity?.toFixed(1) || '--'}%
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Humidity</p>
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {aggregateData.count}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Readings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};