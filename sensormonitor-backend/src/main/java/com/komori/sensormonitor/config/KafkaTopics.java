package com.komori.sensormonitor.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopics {
    public final static String RAW = "raw-data";
    public final static String AGGREGATED = "aggregated-data";
    public final static String ENRICHED = "enriched-data";
    public final static String ALERTS = "alerts";

    @Bean
    public NewTopic rawData() {
        return new NewTopic(RAW, 1, (short) 1);
    }

    @Bean
    public NewTopic aggregatedData() {
        return new NewTopic(AGGREGATED, 1, (short) 1);
    }

    @Bean
    public NewTopic enrichedData() {
        return new NewTopic(ENRICHED, 1, (short) 1);
    }

    @Bean
    public NewTopic alerts() {
        return new NewTopic(ALERTS, 1, (short) 1);
    }
}
