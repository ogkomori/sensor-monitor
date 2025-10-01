package com.komori.sensormonitor.repository;

import com.komori.sensormonitor.sensor.SensorReadingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingRepository extends JpaRepository<SensorReadingEntity, Long> {
    List<SensorReadingEntity> findAllBySensorId(String sensorId);
}
