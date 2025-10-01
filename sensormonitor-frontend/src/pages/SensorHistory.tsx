import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EnrichedSensorReading } from "@/lib/graphql/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Thermometer, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

const SensorHistory = () => {
  const { sensorId } = useParams();
  // Map sensorId to location name
  const sensors = [
    { id: "sensor_01", name: "Office" },
    { id: "sensor_02", name: "Warehouse" },
    { id: "sensor_03", name: "Server Room" },
  ];
  const location = sensors.find(s => s.id === sensorId)?.name || sensorId;

  const [history, setHistory] = useState<EnrichedSensorReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!sensorId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:8080/history/${sensorId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json();
      })
      .then(data => setHistory(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [sensorId]);

  const totalPages = Math.ceil(history.length / pageSize);
  const paginatedHistory = history.slice((page - 1) * pageSize, page * pageSize);

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'NORMAL': return <CheckCircle className="h-4 w-4" />;
      case 'WARNING': return <AlertTriangle className="h-4 w-4" />;
      case 'CRITICAL': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'NORMAL': return 'text-success border-success/20 bg-success/10';
      case 'WARNING': return 'text-warning border-warning/20 bg-warning/10';
      case 'CRITICAL': return 'text-destructive border-destructive/20 bg-destructive/10';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      date: date.toLocaleDateString(),
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">History for {location}</h2>
      {loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 animate-spin" />
              History Entries
            </CardTitle>
            <CardDescription>
              Paginated sensor readings history
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading history...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              History Entries
            </CardTitle>
            <CardDescription>
              Paginated sensor readings history
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No history to display</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {!loading && !error && history.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              History Entries
            </CardTitle>
            <CardDescription>
              Paginated sensor readings history
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No history to display</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {!loading && !error && history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                History Entries
              </CardTitle>
              <CardDescription>
                Paginated sensor readings history
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <ScrollArea className="h-[28rem]">
              <div className="space-y-3">
                {paginatedHistory.map((reading, idx) => {
                  const { time, date } = formatTimestamp(reading.timestamp);
                  return (
                    <div
                      key={`${reading.timestamp}-${idx}`}
                      className={cn(
                        'border rounded-lg p-4 flex flex-col gap-2 bg-white shadow-sm transition-all duration-200',
                        getStatusColor(reading.status)
                      )}
                    >
                      {/* Top row: Temp, Humidity, Time */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-6 w-6 text-blue-600" />
                            <span className="text-2xl font-bold">{reading.temperature?.toFixed(1) || '--'}°C</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplets className="h-6 w-6 text-cyan-600" />
                            <span className="text-2xl font-bold">{reading.humidity || '--'}%</span>
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
                          {getStatusIcon(reading.status)}
                          <Badge variant="outline" className="text-xs">
                            {reading.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{reading.location || 'Unknown'}</span>
                        </div>
                        <span className="text-muted-foreground">{date}</span>
                      </div>
                      {/* Optional message */}
                      {reading.message && (
                        <p className="text-sm text-muted-foreground mt-1">{reading.message}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="flex gap-2 items-center mt-4">
              <button
                className="px-3 py-1 rounded bg-muted"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                className="px-3 py-1 rounded bg-muted"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

}
export default SensorHistory;
