package com.mazanex.profile.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de Swagger para documentar la API de perfiles.
 */
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Mazanex Profile API")
                        .version("1.0")
                        .description("Microservicio encargado de la gestión de perfiles de usuario, avatares y relaciones sociales.")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}