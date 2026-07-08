package com.mazanex.publications.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de Swagger para documentar la API de publicaciones.
 */
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Mazanex Publications API")
                        .version("1.0")
                        .description("Microservicio encargado de las publicaciones, feed de la comunidad y comentarios.")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}