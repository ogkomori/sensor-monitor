import { useParams } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/client/react/hooks";
import { GET_LAST_ALERTS } from "@/lib/graphql/queries";
import { ALERT_STREAM } from "@/lib/graphql/subscriptions";
import { AlertsPanel } from "@/components/sensor/AlertsPanel";
import { useState, useEffect } from "react";
import { EnrichedSensorReading } from "@/lib/graphql/types";

const SensorAlerts = () => {
  const { sensorId } = useParams();
  
  // Query for initial alerts snapshot
  const { data: alertsData, loading: alertsLoading } = useQuery(GET_LAST_ALERTS, {
    variables: { sensorId, limit: 5 },
    skip: !sensorId,
    fetchPolicy: "no-cache",
  });

  // Local state for live alerts data
  const [alerts, setAlerts] = useState<EnrichedSensorReading[]>([]);

  // Initialize state from query when sensorId changes
  useEffect(() => {
    if (alertsData?.lastAlerts) {
      setAlerts(alertsData.lastAlerts);
    }
  }, [sensorId, alertsData?.lastAlerts]);

  // Subscription for live alert updates
  useSubscription(ALERT_STREAM, {
    variables: { sensorId },
    skip: !sensorId,
    onData: ({ data }) => {
      const newAlert = data?.data?.alertStream;
      if (newAlert) {
        setAlerts(prev => {
          // Avoid duplicates by checking timestamp and sensorId
          const isDuplicate = prev.some(
            alert => alert.timestamp === newAlert.timestamp && alert.sensorId === newAlert.sensorId
          );
          
          if (!isDuplicate) {
            // Add new alert to the beginning and keep only the latest 5
            return [newAlert, ...prev].slice(0, 5);
          }
          return prev;
        });
        console.log('[SensorAlerts] New alert received:', newAlert); // Debugging aid
      }
    },
  });

  // Map sensorId to location name
  const sensors = [
    { id: "sensor_01", name: "Office" },
    { id: "sensor_02", name: "Warehouse" },
    { id: "sensor_03", name: "Server Room" },
  ];
  const location = sensors.find(s => s.id === sensorId)?.name || sensorId;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Alerts for {location}</h2>
      <AlertsPanel alerts={alerts} loading={alertsLoading} />
    </div>
  );
};

export default SensorAlerts;
