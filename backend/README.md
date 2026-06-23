##1. Descripción
Backend distribuido de Mazanex, compuesto por microservicios independientes desarrollados en Java 17 con Spring Boot 3.4.5 y Maven. El sistema implementa una arquitectura desacoplada donde cada servicio gestiona su propia lógica de dominio y persistencia.

##2. Ecosistema de Microservicios
A diferencia de un monolito, cada servicio opera de forma autónoma:

ms-auth: Gestión de identidades, registro y seguridad JWT.

ms-profile: Gestión de datos de usuario, bio y relaciones sociales.

ms-projects: Seguimiento de proyectos, tareas y gestión de estados.

ms-publications: Sistema de feeds, interacciones (likes) y comentarios.

ms-ranking: Procesamiento de récords, tablas de posiciones y reportes.

##3. Estructura del Proyecto (Monorepo)
Plaintext
backend/
├── ms-auth/          # Servicio de Autenticación
├── ms-profile/       # Servicio de Perfiles
├── ms-projects/      # Servicio de Proyectos
├── ms-publications/  # Servicio de Publicaciones
└── ms-ranking/       # Servicio de Ranking
##4. Patrones de Diseño Aplicados
Para asegurar la escalabilidad y mantenibilidad, aplicamos:

Repository Pattern: Abstracción mediante JpaRepository para separar la lógica de negocio de la capa de persistencia.

Service Facade: Centralización de lógica compleja en servicios, exponiendo métodos limpios a los controladores.

Strategy Pattern: Implementado en módulos como ms-profile para manejar diferentes tipos de validaciones o procesamientos sin modificar código existente (Open-Closed Principle).

BFF (Backend For Frontend): Comunicación orquestada a través de un Gateway (KrakenD) para unificar la API.

##5. Configuración de Producción (MySQL)
Todos los servicios comparten una lógica de configuración dinámica mediante variables de entorno (optimizada para despliegues en Railway o Kubernetes):

Properties
# Puerto dinámico y conexión a base de datos
server.port=${PORT:8082}

spring.datasource.url=jdbc:mysql://${MYSQLHOST:localhost}:${MYSQLPORT:3306}/${MYSQLDATABASE:mazanex_db}?...
spring.datasource.username=${MYSQLUSER:root}
spring.datasource.password=${MYSQLPASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
##6. Seguridad y Resiliencia
Gestión de Identidad: Implementación de JWT para proteger los endpoints sensibles entre microservicios.

Validación de Datos: Uso de DTOs para evitar el sobre-exposición de entidades @Entity.

Resiliencia: Estructura preparada para integrar Circuit Breaker (Resilience4j) para evitar fallos en cascada entre servicios.

##7. Despliegue e Integración
Contenerización: Cada microservicio cuenta con su propio Dockerfile optimizado.

Orquestación: Se utiliza Kubernetes para gestionar el ciclo de vida de los pods y la comunicación interna.

CI/CD: Pipeline automatizado en GitHub Actions con estrategia de matriz (Matrix Strategy) para ejecutar pruebas unitarias (mvn clean test) en paralelo para todos los servicios.

##8. Guía de Ejecución Local
Para levantar un servicio específico (ejemplo ms-auth):

Bash
cd backend/ms-auth
mvn clean install
mvn spring-boot:run
Nota: Se recomienda el uso de Docker Compose para levantar el entorno completo con bases de datos: docker compose up --build.

Navegación
Volver al Inicio: Contexto de Negocio

Ir al Frontend: Configuración de Cliente

Ver Documentación de K8s: Configuración de Infraestructura
