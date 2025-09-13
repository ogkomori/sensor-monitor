package com.komori.sensormonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SensormonitorApplication {

	public static void main(String[] args) {
		SpringApplication.run(SensormonitorApplication.class, args);
	}

}
