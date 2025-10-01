import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const sensors = [
  { id: "sensor_01", name: "Office" },
  { id: "sensor_02", name: "Warehouse" },
  { id: "sensor_03", name: "Server Room" },
];

const Sidebar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-gray-50 border-r flex flex-col p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">HomePage</h2>
        <button
          className="w-full text-left px-2 py-2 rounded hover:bg-gray-200 cursor-pointer text-gray-700 font-medium"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Sensors</h2>
        {sensors.map((sensor) => (
          <div key={sensor.id} className="mb-2">
            <button
              className="w-full text-left px-2 py-2 rounded hover:bg-gray-200 cursor-pointer text-gray-700 font-medium flex justify-between items-center"
              onClick={() => setOpenDropdown(openDropdown === sensor.id ? null : sensor.id)}
            >
              {sensor.name}
              <span>{openDropdown === sensor.id ? "▲" : "▼"}</span>
            </button>
            {openDropdown === sensor.id && (
              <div className="ml-4 mt-1 flex flex-col gap-1">
                <Link
                  to={`/sensor/${sensor.id}/overview`}
                  className="px-2 py-1 rounded hover:bg-blue-100 text-blue-700"
                >
                  Overview
                </Link>
                <Link
                  to={`/sensor/${sensor.id}/alerts`}
                  className="px-2 py-1 rounded hover:bg-yellow-100 text-yellow-700"
                >
                  Alerts
                </Link>
                <Link
                  to={`/sensor/${sensor.id}/history`}
                  className="px-2 py-1 rounded hover:bg-gray-100 text-gray-500"
                >
                  History
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
