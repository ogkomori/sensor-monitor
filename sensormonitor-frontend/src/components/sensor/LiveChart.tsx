import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Thermometer, Droplets } from 'lucide-react';
import { EnrichedSensorReading } from '@/lib/graphql/types';

interface LiveChartProps {
  latestReading?: EnrichedSensorReading;
  sensorId?: string;
}

interface ChartDataPoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  time: string; // formatted time for display
}

export const LiveChart = ({ latestReading, sensorId }: LiveChartProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (latestReading && latestReading.temperature !== undefined && latestReading.humidity !== undefined) {
      const newDataPoint: ChartDataPoint = {
        timestamp: latestReading.timestamp,
        temperature: latestReading.temperature,
        humidity: latestReading.humidity,
        time: new Date(latestReading.timestamp).toLocaleTimeString(),
      };

      setChartData(prevData => {
        const updatedData = [...prevData, newDataPoint];
        // Keep only the last 20 data points for better visualization
        return updatedData.slice(-20);
      });
    }
  }, [latestReading]);

  // Reset chart data when sensor changes
  useEffect(() => {
    setChartData([]);
  }, [sensorId]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.dataKey === 'temperature' ? '°C' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Sensor Readings
            </CardTitle>
            <CardDescription>
              Real-time temperature and humidity data for {sensorId || 'selected sensor'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              Temperature
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Droplets className="h-3 w-3" />
              Humidity
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {sensorId ? 'Waiting for live data...' : 'Select a sensor to view live readings'}
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  yAxisId="temperature"
                  orientation="left"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="humidity"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="temperature"
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Temperature"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  name="Humidity"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
