# Sensor Monitor

**Sensor Monitor** is a real-time IoT data monitoring system built with SpringBoot and a React frontend. It allows you to simulate, aggregate, and visualize sensor readings for multiple devices, all running inside Docker containers for easy deployment.  

## Features

- Real-time simulation of sensor readings (temperature and humidity)
- Aggregated sensor data for multiple sensors
- Dashboard with live updates
- Fully containerized backend for easy setup
- Frontend built with a modern JS framework for responsive monitoring

## Screenshots
<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/920dee8e-3bb7-4469-ab48-c8dfef4ab945" alt="Screenshot 1" width="500"></td>
    <td><img src="https://github.com/user-attachments/assets/2deb113e-1e23-4676-8a4b-4b75df790481" alt="Screenshot 2" width="500"></td>
  </tr>
</table>

## Getting Started

### Prerequisites

- Git
- Docker and Docker Compose
- Node.js and npm (for the frontend)

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/ogkomori/sensor-monitor
cd sensor-monitor/sensormonitor-backend
```
2. Start the backend (Dockerized):
```bash
docker-compose up --build
```
3. Check if the Spring Boot app has started successfully:
```bash
docker logs sensor-monitor-app 2>&1 | grep -i "started springboot application"
```
If you see the message, your backend is running and ready to accept connections.

4. Start the frontend:
```bash
cd ../sensormonitor-frontend
npm install
npm run dev
```
Open your browser and visit the URL shown in the terminal (usually http://localhost:5173) to access the dashboard.

### Tech Stack

- Backend: Java, Kafka, Docker, GraphQL
- Frontend: TypeScript (React)
- DB: Redis, Postgres
