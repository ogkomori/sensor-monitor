import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface SensorSelectorProps {
  onSensorSelect: (sensorId: string) => void;
  currentSensorId?: string;
}

export const SensorSelector = ({ onSensorSelect, currentSensorId }: SensorSelectorProps) => {
  const [inputValue, setInputValue] = useState(currentSensorId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSensorSelect(inputValue.trim());
    }
  };

  // Quick select common sensor IDs
  const commonSensors = ['sensor-001', 'sensor-002', 'sensor-003'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Sensor Selection
        </CardTitle>
        <CardDescription>
          Select a sensor to monitor its readings and receive real-time alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="sensorId">Sensor ID</Label>
            <Input
              id="sensorId"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter sensor ID (e.g., sensor-001)"
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full">
            Monitor Sensor
          </Button>
        </form>
        
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Quick Select:</Label>
          <div className="flex gap-2 flex-wrap">
            {commonSensors.map((sensorId) => (
              <Button
                key={sensorId}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue(sensorId);
                  onSensorSelect(sensorId);
                }}
              >
                {sensorId}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};