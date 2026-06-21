package com.mazanex.projects.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Mazanex Projects API")
                .version("1.0")
                .description("Microservicio de Gestión de Proyectos para Innovatech Solutions"));
    }
}