import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Thermometer, Droplets } from 'lucide-react';
import { EnrichedSensorReading } from '@/lib/graphql/types';
import { cn } from '@/lib/utils';

interface AlertsPanelProps {
  alerts: EnrichedSensorReading[];
  newAlert?: EnrichedSensorReading;
  loading?: boolean;
}

const getAlertIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'NORMAL':
      return <CheckCircle className="h-4 w-4" />;
    case 'WARNING':
      return <AlertTriangle className="h-4 w-4" />;
    case 'CRITICAL':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getAlertColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'NORMAL':
      return 'text-success border-success/20 bg-success/10';
    case 'WARNING':
      return 'text-warning border-warning/20 bg-warning/10';
    case 'CRITICAL':
      return 'text-destructive border-destructive/20 bg-destructive/10';
    default:
      return 'text-muted-foreground border-border bg-muted/10';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
    date: date.toLocaleDateString(),
  };
};

export const AlertsPanel = ({ alerts: initialAlerts, newAlert, loading }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<EnrichedSensorReading[]>(initialAlerts || []);

  // Update alerts when initial alerts change (from query)
  useEffect(() => {
    if (initialAlerts) {
      setAlerts(initialAlerts);
    }
  }, [initialAlerts]);

  // Add new alert from subscription
  useEffect(() => {
    if (newAlert) {
      setAlerts(prevAlerts => {
        // Avoid duplicates by checking timestamp and sensorId
        const isDuplicate = prevAlerts.some(
          alert => alert.timestamp === newAlert.timestamp && alert.sensorId === newAlert.sensorId
        );
        
        if (!isDuplicate) {
          // Add new alert to the beginning and keep only the latest 10
          return [newAlert, ...prevAlerts].slice(0, 10);
        }
        return prevAlerts;
      });
    }
  }, [newAlert]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Loading alerts...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Recent Alerts
        </CardTitle>
        <CardDescription>
          Latest alerts and status updates from monitored sensors
        </CardDescription>
      </CardHeader>
      <CardContent className="py-6">
        <ScrollArea className="h-[30rem]">
          {alerts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No alerts to display</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const { time, date } = formatTimestamp(alert.timestamp);
                return (
                  <div
                    key={`${alert.timestamp}-${index}`}
                    className={cn(
                      'border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm transition-all duration-200',
                      getAlertColor(alert.status),
                      index === 0 && newAlert?.timestamp === alert.timestamp ? 'animate-pulse' : ''
                    )}
                  >
                    {/* Top row: Temp, Humidity, Heat Index, Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-6 w-6 text-blue-600" />
                          <span className="text-2xl font-bold">{alert.temperature?.toFixed(1) || '--'}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-6 w-6 text-cyan-600" />
                          <span className="text-2xl font-bold">{alert.humidity || '--'}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-orange-600">Heat Index</span>
                          <span className="text-xl font-bold">{alert.heatIndex?.toFixed(1) || '--'}°C</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg font-semibold">{time}</span>
                      </div>
                    </div>
                    {/* Secondary row: Status, Location, Date */}
                    <div className="flex items-center justify-between text-xs mt-1">
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.status)}
                        <Badge variant="outline" className="text-xs">
                          {alert.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location || 'Unknown'}</span>
                      </div>
                      <span className="text-muted-foreground">{date}</span>
                    </div>
                    {/* Optional message */}
                    {alert.message && (
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
