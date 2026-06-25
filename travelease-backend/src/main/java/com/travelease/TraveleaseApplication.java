package com.travelease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TraveleaseApplication {

    public static void main(String[] args) {
        SpringApplication.run(TraveleaseApplication.class, args);
    }
}
