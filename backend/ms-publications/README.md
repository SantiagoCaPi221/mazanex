# README Publications Service

## 1. Descripción

Microservicio de gestión de publicaciones, likes y comentarios para Mazanex. Proporciona toda la funcionalidad del muro de la comunidad donde los usuarios pueden crear posts, compartir contenido multimedia, dar likes y comentar.

## 2. Responsabilidades

- Crear publicaciones (posts) en el muro.
- Listar publicaciones globales (feed).
- Listar publicaciones de usuarios específicos.
- Agregar y quitar likes a publicaciones (toggle).
- Agregar comentarios a publicaciones.
- Eliminar publicaciones y sus comentarios asociados.

## 3. Arquitectura de software

```text
PublicationController
    └── PublicationService
            ├── PublicationRepository
            ├── CommentRepository
            └── MySQL
```

- `PublicationController`: recibe solicitudes HTTP del muro.
- `PublicationService`: aplica reglas de negocio y validación.
- `PublicationRepository`: maneja persistencia de publicaciones con JPA.
- `CommentRepository`: maneja persistencia de comentarios con JPA.
- `Publication`: entidad de publicación con soporte para likes y comentarios.
- `Comment`: entidad de comentario asociada a publicaciones.

## 4. Endpoints Principales

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/publications/feed` | Obtener el feed (muro global) |
| GET | `/api/publications/user/{userId}` | Obtener publicaciones de un usuario |
| POST | `/api/publications` | Crear publicación |
| POST | `/api/publications/{id}/like` | Dar o quitar like (toggle) |
| POST | `/api/publications/{id}/comment` | Agregar comentario |
| DELETE | `/api/publications/{id}/{userId}` | Eliminar publicación |

## 5. Tecnologías

| Tecnología | Versión |
|------------|---------|
| Java | 17 LTS |
| Spring Boot | 3.2.5 |
| Spring Data JPA | Incluida |
| Spring Security | Incluida |
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
| Compilación | Maven |
| Docker | Docker multi-stage |

## 7. Seguridad

- **JWT**: Validación de tokens para operaciones de publicación y comentarios.
- **Spring Security**: Control de acceso a endpoints.
- **CORS**: Habilitado para integración con frontend.
- **Validación de autoría**: Solo el autor de una publicación puede eliminarla.
- **Encapsulación de datos**: Los datos sensibles se manejan con DTOs.

## 8. Entidades y Base de Datos

### Tabla `publications`

Almacena las publicaciones del muro:
- `id` (PK): Identificador único
- `authorId`: ID del usuario autor
- `authorName`: Nombre del autor
- `authorAvatarUrl`: URL del avatar del autor
- `content`: Contenido de la publicación (hasta 2000 caracteres)
- `mediaUrl`: URL de medios (imágenes/videos) o Base64 codificado (LONGTEXT)
- `createdAt`: Fecha de creación

### Tabla `publication_likes`

Tabla de relación para los likes (muchos a muchos):
- `publication_id` (FK): ID de la publicación
- `user_id`: ID del usuario que dio like

### Tabla `comments`

Almacena los comentarios de las publicaciones:
- `id` (PK): Identificador único
- `publication_id` (FK): ID de la publicación comentada
- `authorId`: ID del usuario autor del comentario
- `authorName`: Nombre del autor
- `authorAvatarUrl`: URL del avatar del autor
- `content`: Contenido del comentario (hasta 1000 caracteres)
- `createdAt`: Fecha de creación

### Configuración en `application.properties`

```properties
spring.datasource.url=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
spring.datasource.username=${MYSQLUSER}
spring.datasource.password=${MYSQLPASSWORD}
spring.jpa.hibernate.ddl-auto=update
server.port=${PORT:8085}
```

## 9. Flujo de Petición

### Crear una publicación

1. El frontend envía `POST /api/publications` con `PublicationDto`.
2. `PublicationController` recibe la petición.
3. `PublicationService` valida los datos y crea la entidad `Publication`.
4. `PublicationRepository` persiste en MySQL.
5. Se devuelve la publicación creada en JSON.

### Dar un like

1. El frontend envía `POST /api/publications/{id}/like` con `{ "userId": 123 }`.
2. `PublicationController` recibe la petición.
3. `PublicationService` ejecuta `toggleLike()` en la publicación.
4. El método remueve el like si ya existe o lo agrega si no existe (toggle).
5. `PublicationRepository` persiste los cambios.
6. Se devuelve el estado actual de likes.

### Agregar un comentario

1. El frontend envía `POST /api/publications/{id}/comment` con `CommentDto`.
2. `PublicationController` recibe la petición.
3. `PublicationService` valida y crea la entidad `Comment`.
4. `CommentRepository` persiste en MySQL.
5. La relación cascada actualiza la `Publication`.
6. Se devuelve el comentario creado.

### Eliminar una publicación

1. El frontend envía `DELETE /api/publications/{id}/{userId}`.
2. `PublicationController` recibe la petición.
3. `PublicationService` valida que `userId` sea el autor.
4. Si es válido, elimina la publicación y sus comentarios (cascada).
5. Se devuelve `{ "status": "DELETED" }`.

## 10. Contenedorización

- **Dockerfile**: Multi-stage build.
- **Builder stage**: Maven 3.8.5 + OpenJDK 17.
- **Runtime stage**: Eclipse Temurin 17 Alpine (imagen ligera).
- **Puerto dinámico**: La aplicación usa `PORT` con valor por defecto `8085`.
- **Integración en Docker Compose**: El servicio `publications-service` se orquesta con la base de datos MySQL.

## 11. Variables de Entorno

```
MYSQLHOST           - Host de MySQL (ej: mysql-publications)
MYSQLPORT           - Puerto de MySQL (ej: 3306)
MYSQLDATABASE       - Nombre de la base de datos (ej: publications_db)
MYSQLUSER           - Usuario de MySQL
MYSQLPASSWORD       - Contraseña de MySQL
PORT                - Puerto de la aplicación (default: 8085)
```

## 12. Setup Local

### Con Maven

```bash
cd backend/ms-publications
./mvnw spring-boot:run
```

El servicio estará disponible en `http://localhost:8085`.

### Con Docker Compose

```bash
cd backend
docker-compose up --build publications-service
```

## 13. Pruebas de Endpoints

### Obtener Feed

```bash
curl -X GET http://localhost:8085/api/publications/feed
```

### Crear Publicación

```bash
curl -X POST http://localhost:8085/api/publications \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": 1,
    "authorName": "Juan Pérez",
    "authorAvatarUrl": "https://...",
    "content": "¡Hola comunidad!",
    "mediaUrl": "https://..."
  }'
```

### Dar Like

```bash
curl -X POST http://localhost:8085/api/publications/1/like \
  -H "Content-Type: application/json" \
  -d '{"userId": 2}'
```

### Agregar Comentario

```bash
curl -X POST http://localhost:8085/api/publications/1/comment \
  -H "Content-Type: application/json" \
  -d '{
    "authorId": 2,
    "authorName": "María García",
    "authorAvatarUrl": "https://...",
    "content": "¡Excelente publicación!"
  }'
```

### Eliminar Publicación

```bash
curl -X DELETE http://localhost:8085/api/publications/1/1
```

## 14. Documentación Interactiva

La API está documentada con **Swagger OpenAPI**:

```
http://localhost:8085/swagger-ui.html
```

Aquí puedes probar todos los endpoints de forma interactiva.

## 15. Resiliencia y Manejo de Errores

- **Circuit Breaker**: Utiliza Resilience4j para manejar fallos en comunicaciones externas.
- **Validaciones**: Se valida la autoría antes de eliminar publicaciones.
- **Códigos HTTP**: 
  - `200 OK`: Operación exitosa.
  - `400 Bad Request`: Datos inválidos.
  - `403 Forbidden`: Acceso denegado (ej: intento de eliminar publicación ajena).
  - `404 Not Found`: Publicación o usuario no encontrado.
  - `500 Internal Server Error`: Error en servidor.

## 16. Escalabilidad

- **Database Indexing**: Las consultas están optimizadas con índices en `authorId` y relaciones.
- **Lazy Loading**: Los comentarios se cargan solo cuando es necesario.
- **Caching**: Se puede implementar Redis para cachear el feed.
- **Horizontal Scaling**: Múltiples instancias de este microservicio pueden correr detrás de un load balancer.
