package com.mazanex.publications;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

/**
 * Clase principal de arranque del microservicio de publicaciones.
 */
@SpringBootApplication
public class PublicationsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PublicationsApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
