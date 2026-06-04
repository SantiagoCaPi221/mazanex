# Readme Profile Service

## 1. Descripción

Microservicio que gestiona perfiles, comunidad, relaciones sociales y puntajes de juego.

## 2. Responsabilidades

## Responsabilidades

- Mantener perfiles de usuario.
- Guardar y consultar puntajes.
- Gestionar solicitudes sociales.
- Entregar notificaciones.
- Sincronizar perfil con Auth cuando aplica.

## 3. Arquitectura de software
## Arquitectura de software

```text
ProfileController    SocialController    GameController
      │                  │                 │
      └──────────────┬───┴─────────────┬───┘
                     │                 │
                 ProfileService    SocialService    GameService
                     │                 │                 │
                     └─────────┬───────┴───────┬─────────┘
                               │               │
                           Repositories       MySQL
```

- `ProfileController`: CRUD y sincronización de perfiles.
- `SocialController`: relaciones, seguimientos y notificaciones.
- `GameController`: puntajes y rankings.
- Repositorios JPA: acceso a datos de usuario, scores, notificaciones, solicitudes y seguidores.

## 4. Endpoints Principales
## Endpoints Principales

| Método | Endpoint | Función |
|---|---|---|
| PUT | `/api/profile/{id}` | Actualizar perfil |
| POST | `/api/profile/sync` | Crear o sincronizar perfil |
| GET | `/api/profile/list` | Listar perfiles |
| DELETE | `/api/profile/{id}` | Eliminar perfil |
| POST | `/api/profile/social/send-request/{senderId}/{receiverId}` | Enviar solicitud |
| POST | `/api/profile/social/accept-request/{senderId}/{receiverId}` | Aceptar solicitud |
| GET | `/api/profile/social/notifications/{userId}` | Listar notificaciones |
| PUT | `/api/profile/social/notifications/{userId}/read` | Marcar notificaciones leídas |
| GET | `/api/profile/games/ranking/{game}` | Obtener ranking |
| POST | `/api/profile/games/save-record` | Guardar puntaje |

## 5. Docker y deployment

- Dockerfile en `backend/microservicio_profile/profile/Dockerfile`.
- Multi-stage build con Maven 3.8.5 y Java 17.
- El servicio usa `PORT` dinámico con valor por defecto `8082`.
- `backend/docker-compose.yml` incluye el servicio `perfil-service` y la base de datos MySQL.

## 6. Setup

### Local con Maven


## Docker y deployment

- Dockerfile en `backend/microservicio_profile/profile/Dockerfile`.
- Multi-stage build con Maven 3.8.5 y Java 17.
- El servicio usa `PORT` dinámico con valor por defecto `8082`.
- `backend/docker-compose.yml` incluye el servicio `perfil-service` y la base de datos MySQL.

## Setup

### Local con Maven

```bash
cd backend/microservicio_profile/profile
./mvnw spring-boot:run
```

### Con Docker Compose

```bash
cd backend
docker-compose up --build
```

## 7. Configuración
## Configuración

- `src/main/resources/application.properties` usa variables de entorno MySQL.
- `server.port=${PORT:8082}` controla el puerto de la aplicación.

## 8. Variables de Entorno

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `PORT`

## 9. Flujo de petición

1. El gateway BFF recibe la petición del frontend.
2. El controlador correspondiente procesa la ruta.
3. El servicio ejecuta la lógica de negocio.
4. El repositorio accede a la base de datos.
5. Se devuelve JSON al frontend.

## 10. Integración

- El frontend consume este servicio a través del gateway en `frontend/app/api/gateway/[...path]/route.ts`.
- `ProfileService` puede sincronizar con un endpoint de Auth vía RestTemplate.

## 11. Variables de Entorno

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `PORT`

## 12. Flujo de petición

1. El gateway BFF recibe la petición del frontend.
2. El controlador correspondiente procesa la ruta.
3. El servicio ejecuta la lógica de negocio.
4. El repositorio accede a la base de datos.
5. Se devuelve JSON al frontend.

## 13. Integración

- El frontend consume este servicio a través del gateway en `frontend/app/api/gateway/[...path]/route.ts`.
- `ProfileService` puede sincronizar con un endpoint de Auth vía RestTemplate.

* * Volver al Inicio:** [Contexto de Negocio](../../../README.md)
* **Raíz del Backend:** [Arquitectura General](../../README.md)
* * Ir al Frontend:** [Configuración de Cliente](../../../frontend/README.md)
* **Auth:** [Microservicio Auth](../../microservicio_auth/auth/README.md)
