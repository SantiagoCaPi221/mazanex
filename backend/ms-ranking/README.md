# README Ranking Service

## 1. Descripción

Microservicio de gestión de rankings, puntuaciones y récords para Mazanex. Proporciona funcionalidad de tablas de clasificación globales, récords por usuario, almacenamiento de puntuaciones con evidencia visual (screenshots) y sistema de reportes para detectar fraude en las puntuaciones.

## 2. Responsabilidades

- Obtener récords de un usuario específico.
- Obtener ranking global por juego.
- Guardar nuevos récords con screenshot de evidencia.
- Reportar puntuaciones sospechosas o fraudulentas.
- Verificar integridad de puntuaciones.
- Mantener historial de puntuaciones.

## 3. Arquitectura de software

```text
RankingController
    └── RankingService
            ├── ScoreRepository
            └── MySQL
```

- `RankingController`: recibe solicitudes HTTP de rankings y puntuaciones.
- `RankingService`: aplica reglas de negocio y validación de puntuaciones.
- `ScoreRepository`: maneja persistencia de puntuaciones con JPA.
- `Score`: entidad de puntuación con soporte para reportes.

## 4. Endpoints Principales

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/ranking/user/{userId}` | Obtener récords de un usuario |
| GET | `/api/ranking/{game}` | Obtener ranking global por juego |
| POST | `/api/ranking/save-record` | Guardar nuevo récord |
| POST | `/api/ranking/report/{id}` | Reportar puntuación sospechosa |

## 5. Tecnologías

| Tecnología | Versión |
|------------|---------|
| Java | 17 LTS |
| Spring Boot | 3.2.5 |
| Spring Data JPA | Incluida |
| Spring Security | Incluida |
| Spring AOP | Incluida |
| JWT (JJWT) | 0.11.5 |
| MySQL Connector | Latest (prod) |
| SpringDoc OpenAPI | 2.5.0 |
| Resilience4j | 3.0.0 |
| Lombok | Latest |
| Maven | 3.8.1+ |

## 6. Arquitectura Técnica

| Capa | Tecnología |
|---|---|
| Lenguaje | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Seguridad | Spring Security + JWT |
| Persistencia | Spring Data JPA, MySQL Connector/J |
| Resiliencia | Circuit Breaker (Resilience4j) |
| Aspecto Transversal | Spring AOP |
| Compilación | Maven |
| Docker | Docker multi-stage |

## 7. Seguridad

- **JWT**: Validación de tokens para operaciones de guardar récords.
- **Spring Security**: Control de acceso a endpoints.
- **Sistema de reportes**: Detección de fraude mediante múltiples reportes de usuarios.
- **Verificación de puntuaciones**: Campo `verified` para marcar puntuaciones auditadas.
- **Screenshot como evidencia**: Almacenamiento de LONGTEXT para imágenes Base64 o URLs.

## 8. Entidades y Base de Datos

### Tabla `scores`

Almacena las puntuaciones y récords de los usuarios:
- `id` (PK): Identificador único
- `user_id`: ID del usuario que registró el récord
- `player_name`: Nombre del jugador
- `game`: Nombre del juego (ej: "Tetris", "Snake", "Chess")
- `mode`: Modo de juego (ej: "Classic", "Arcade", "Time Attack")
- `highScore`: Puntuación máxima obtenida
- `screenshotUrl`: URL o Base64 de la imagen de prueba (LONGTEXT)
- `verified`: Boolean para marcar si ha sido verificada por un moderador
- `uploadDate`: Fecha de registro de la puntuación

### Tabla `score_reports`

Tabla de relación para los reportes de fraude:
- `score_id` (FK): ID de la puntuación reportada
- `reporter_id`: ID del usuario que reportó

### Configuración en `application.properties`

```properties
spring.datasource.url=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
spring.datasource.username=${MYSQLUSER}
spring.datasource.password=${MYSQLPASSWORD}
spring.jpa.hibernate.ddl-auto=update
server.port=${PORT:8083}
```

## 9. DTOs (Data Transfer Objects)

### ScoreRequestDto (Record)

```java
public record ScoreRequestDto(
    Long userId,
    String playerName,
    String game,
    String mode,
    Integer highScore,
    String screenshotUrl
) {}
```

Utilizado para recibir datos de nuevos récords desde el frontend.

## 10. Flujo de Petición

### Guardar un nuevo récord

1. El frontend envía `POST /api/ranking/save-record` con `ScoreRequestDto`.
2. `RankingController` recibe y loguea la petición.
3. `RankingService` valida los datos (usuario válido, puntuación coherente).
4. Se crea la entidad `Score` con `verified = false` inicialmente.
5. `ScoreRepository` persiste en MySQL.
6. Se devuelve el récord creado con su ID.

### Obtener ranking por juego

1. El frontend envía `GET /api/ranking/{game}` (ej: `/api/ranking/Tetris`).
2. `RankingController` recibe la petición.
3. `RankingService` consulta todas las puntuaciones del juego.
4. Se ordena por `highScore` descendente (puntuación más alta primero).
5. Se devuelve la lista completa de puntuaciones.

### Reportar fraude

1. El frontend envía `POST /api/ranking/report/{id}` con `{ "reporterId": 123 }`.
2. `RankingController` recibe la petición.
3. `RankingService` valida que el reportero sea diferente del autor.
4. Se añade el reportero a la colección `reporters`.
5. Si el número de reportes supera un umbral, la puntuación se puede marcar como sospechosa.
6. Se devuelve el estado actualizado.

### Obtener récords de un usuario

1. El frontend envía `GET /api/ranking/user/{userId}`.
2. `RankingController` recibe la petición.
3. `RankingService` consulta todas las puntuaciones del usuario.
4. Se devuelve la lista de récords personales.

## 11. Contenedorización

- **Dockerfile**: Multi-stage build.
- **Builder stage**: Maven 3.8.5 + OpenJDK 17.
- **Runtime stage**: Eclipse Temurin 17 Alpine (imagen ligera).
- **Puerto dinámico**: La aplicación usa `PORT` con valor por defecto `8083`.
- **Integración en Docker Compose**: El servicio `ranking-service` se orquesta con la base de datos MySQL.

## 12. Variables de Entorno

```
MYSQLHOST           - Host de MySQL (ej: mysql-ranking)
MYSQLPORT           - Puerto de MySQL (ej: 3306)
MYSQLDATABASE       - Nombre de la base de datos (ej: ranking_db)
MYSQLUSER           - Usuario de MySQL
MYSQLPASSWORD       - Contraseña de MySQL
PORT                - Puerto de la aplicación (default: 8083)
```

## 13. Setup Local

### Con Maven

```bash
cd backend/ms-ranking
./mvnw spring-boot:run
```

El servicio estará disponible en `http://localhost:8083`.

### Con Docker Compose

```bash
cd backend
docker-compose up --build ranking-service
```

## 14. Pruebas de Endpoints

### Obtener ranking global

```bash
curl -X GET http://localhost:8083/api/ranking/Tetris
```

### Guardar un nuevo récord

```bash
curl -X POST http://localhost:8083/api/ranking/save-record \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "playerName": "Juan Pérez",
    "game": "Tetris",
    "mode": "Classic",
    "highScore": 25000,
    "screenshotUrl": "https://..."
  }'
```

### Obtener récords de un usuario

```bash
curl -X GET http://localhost:8083/api/ranking/user/1
```

### Reportar puntuación sospechosa

```bash
curl -X POST http://localhost:8083/api/ranking/report/5 \
  -H "Content-Type: application/json" \
  -d '{"reporterId": 2}'
```

## 15. Documentación Interactiva

La API está documentada con **Swagger OpenAPI**:

```
http://localhost:8083/swagger-ui.html
```

Aquí puedes probar todos los endpoints de forma interactiva.

## 16. Sistema de Reportes y Fraude

- **Colección `reporters`**: Almacena los IDs de usuarios que reportaron la puntuación.
- **Método `addReport()`**: Agrega un nuevo reporte y devuelve `true` si es la primera vez.
- **Método `getReportCount()`**: Devuelve el número total de reportes.
- **Umbral de verificación**: Se sugiere verificar automáticamente o marcar como sospechosa si hay más de 3 reportes.

## 17. Resiliencia y Manejo de Errores

- **Circuit Breaker**: Utiliza Resilience4j para manejar fallos en comunicaciones externas.
- **Logging**: Utiliza SLF4J para registrar operaciones importantes (ej: nuevos récords guardados).
- **Validaciones**: Se valida que los datos sean coherentes antes de guardar.
- **Códigos HTTP**: 
  - `200 OK`: Operación exitosa.
  - `400 Bad Request`: Datos inválidos.
  - `404 Not Found`: Puntuación, usuario o juego no encontrado.
  - `500 Internal Server Error`: Error en servidor.

## 18. Escalabilidad y Optimización

- **Database Indexing**: Índices en `user_id`, `game` y `uploadDate` para consultas rápidas.
- **Paginación**: Se puede implementar paginación en ranking para grandes volúmenes.
- **Caching**: Se puede cachear rankings populares con Redis.
- **Compresión de screenshots**: Se recomienda comprimir o redimensionar imágenes antes de almacenar.
- **Horizontal Scaling**: Múltiples instancias detrás de un load balancer.

## 19. Integración con otros Microservicios

- **ms-profile**: Obtiene información del usuario (nombre, avatar) para asociar a puntuaciones.
- **ms-publications**: Permite compartir récords en el muro de la comunidad.
- **BFF (Backend for Frontend)**: El frontend comunica a través del gateway BFF que orquesta llamadas a este servicio.
