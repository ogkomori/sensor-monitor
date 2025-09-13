package com.komori.sensormonitor.config;

import com.komori.sensormonitor.sensor.AggregateData;
import com.komori.sensormonitor.sensor.EnrichedSensorReading;
import com.komori.sensormonitor.heat.HeatIndexCalculator;
import com.komori.sensormonitor.heat.HeatIndexWarning;
import com.komori.sensormonitor.sensor.SensorReading;
import com.komori.sensormonitor.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.support.serializer.JsonSerde;

import java.time.Duration;

@Configuration
@RequiredArgsConstructor
public class KafkaStreamConfig {
    private final RedisTemplate<String, Object> redisTemplate;
    private final SubscriptionService subscriptionService;

    @Bean
    public KStream<String, AggregateData> aggregateStream() {
        KStream<String, SensorReading> rawStream = builder().stream(
                KafkaTopics.RAW,
                Consumed.with(Serdes.String(), new JsonSerde<>(SensorReading.class))
        );

        KStream<String, AggregateData> aggStream = rawStream
                .groupByKey()
                .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(1)))
                .aggregate(
                        AggregateData::new, // initializer
                        (key, reading, agg) -> {
                            agg.setSensorId(reading.getSensorId());
                            agg.setCount(agg.getCount() + 1);
                            agg.setAvgHumidity(updateAverage(reading.getHumidity(), agg.getAvgHumidity(), agg.getCount()));
                            agg.setAvgTemperature(updateAverage(reading.getTemperature(), agg.getAvgTemperature(), agg.getCount()));
                            return agg;
                        },
                        Materialized.with(Serdes.String(), new JsonSerde<>(AggregateData.class))
                )
//                .suppress(Suppressed.untilWindowCloses(new StrictBufferConfigImpl())) --> prevents values from showing between windows
                .toStream()
                .map((window, agg) -> {
                    agg.setWindowStart(window.window().startTime().toString());
                    agg.setWindowEnd(window.window().endTime().toString());
                    return new KeyValue<>(window.key(), agg); // get the String from Windowed<String>
                });

        // Save to redis
        aggStream.foreach((sensorId, agg) -> {
            String redisKey = "sensor:" + sensorId + ":aggregate";
            redisTemplate.opsForValue().set(redisKey, agg);
        });

        // Send to topic
        aggStream.to(KafkaTopics.AGGREGATED, Produced.with(Serdes.String(), new JsonSerde<>(AggregateData.class)));
        return aggStream;
    }

    @Bean
    public KStream<String, EnrichedSensorReading> enrichedStream() {
        KStream<String, SensorReading> rawStream = builder().stream(
                KafkaTopics.RAW,
                Consumed.with(Serdes.String(), new JsonSerde<>(SensorReading.class))
        );

        KStream<String, EnrichedSensorReading> enrichedStream = rawStream.mapValues(this::toEnrichedReading);

        // Save to Redis and Push to subscriber
        enrichedStream.foreach((sensorId, reading) -> {
            String redisKey = "sensor:" + sensorId + ":latest";
            redisTemplate.opsForValue().set(redisKey, reading);
            subscriptionService.pushLatestReading(reading);
        });

        // Send to topic
        enrichedStream.to(KafkaTopics.ENRICHED, Produced.with(Serdes.String(), new JsonSerde<>(EnrichedSensorReading.class)));
        return enrichedStream;
    }

    @Bean
    public KStream<String, EnrichedSensorReading> alertStream() {
        KStream<String, EnrichedSensorReading> enrichedStream = builder().stream(
                KafkaTopics.ENRICHED,
                Consumed.with(Serdes.String(), new JsonSerde<>(EnrichedSensorReading.class))
        );

        KStream<String, EnrichedSensorReading> alertStream = enrichedStream.filter(
                (key, reading) -> !reading.getStatus().equals("OK")
        );

        // Write alerts to Redis and Push to subscriber
        alertStream.foreach((sensorId, reading) -> {
            String redisKey = "alerts:" + reading.getSensorId();
            redisTemplate.opsForList().leftPush(redisKey, reading); // Keeps the latest alerts at the beginning
            redisTemplate.opsForList().trim(redisKey, 0,9); // Shows the last 10 alerts for a sensor
            subscriptionService.pushAlert(reading);
        });

        alertStream.to(KafkaTopics.ALERTS, Produced.with(Serdes.String(), new JsonSerde<>(EnrichedSensorReading.class)));

        return alertStream;
    }

    @Bean
    public StreamsBuilder builder() {
        return new StreamsBuilder();
    }

    private EnrichedSensorReading toEnrichedReading(SensorReading reading) {
        double heatIndex = HeatIndexCalculator.getHeatIndex(reading.getTemperature(), reading.getHumidity());
        HeatIndexWarning warning = HeatIndexCalculator.getWarning(heatIndex);
        return EnrichedSensorReading.builder()
                .status(warning.getStatus())
                .message(warning.getMessage())
                .humidity(reading.getHumidity())
                .temperature(reading.getTemperature())
                .heatIndex(heatIndex)
                .sensorId(reading.getSensorId())
                .location(reading.getLocation())
                .timestamp(reading.getTimestamp())
                .build();
    }

    private double updateAverage(double newValue, double oldAverage, double newCount) {
        return ((oldAverage * (newCount - 1)) + newValue) / newCount;
    }
}
