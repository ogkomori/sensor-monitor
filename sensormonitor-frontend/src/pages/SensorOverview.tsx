import { useParams } from "react-router-dom";
import { MetricsCards } from "@/components/sensor/MetricsCards";
import { LiveChart } from "@/components/sensor/LiveChart";
import { useLiveSensorData } from "@/hooks/useLiveSensorData";

const SensorOverview = () => {
  const { sensorId } = useParams();

  // Only fetch if sensorId exists
  const { latestReadings, aggregateStats, isLoading } = useLiveSensorData(sensorId);

  // Map sensorId to location name
  const sensors = [
    { id: "sensor_01", name: "Office" },
    { id: "sensor_02", name: "Warehouse" },
    { id: "sensor_03", name: "Server Room" },
  ];
  const location = sensors.find(s => s.id === sensorId)?.name || "Unknown Sensor";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Overview for {location}</h2>

      <div className="mb-6">
        <MetricsCards
          latestReading={latestReadings?.[0] || null}
          aggregateData={aggregateStats || null}
          loading={isLoading}
        />
      </div>

      {sensorId ? (
        <LiveChart
          key={sensorId} // ensures chart remounts on sensor change
          latestReadings={latestReadings}
          sensorId={sensorId}
        />
      ) : (
        <p>No sensor selected.</p>
      )}
    </div>
  );
};

export default SensorOverview;
