# Auth Service

## Descripción

Microservicio de autenticación y gestión de usuarios para Mazanex.

## Responsabilidades

- Registrar usuarios.
- Iniciar sesión.
- Listar usuarios.
- Actualizar perfil.
- Cambiar contraseña.
- Eliminar cuentas.

## Arquitectura de software

```text
AuthController
    └── AuthService
            └── UserRepository
                    └── MySQL
```

- `AuthController`: recibe solicitudes HTTP.
- `AuthService`: aplica reglas de negocio y validación.
- `UserRepository`: maneja persistencia con JPA.
- `User`: entidad de usuario.

## Endpoints Principales

| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/users` | Listar usuarios |
| PUT | `/api/auth/profile/{id}` | Actualizar perfil |
| PUT | `/api/auth/{id}/password` | Cambiar contraseña |
| DELETE | `/api/auth/{id}` | Eliminar usuario |

## Tecnologías Utilizadas

| Capa | Tecnología |
|---|---|
| Lenguaje | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Persistencia | Spring Data JPA, MySQL Connector/J |
| Compilación | Maven |
| Docker | Docker multi-stage |


## Base de Datos

- Tabla principal: `users`.
- Entidad `User` incluye: `id`, `name`, `email`, `password`, `role`, `avatarUrl`, `bannerUrl`, `bio`, `backgroundUrl`.
- Configuración en `src/main/resources/application.properties` usa variables de entorno MySQL.

## Contenedorización

- Dockerfile con build multi-stage.
- Base de imagen: Maven 3.8.5 + OpenJDK 17.
- Runtime: Eclipse Temurin 17 Alpine.
- El servicio usa `PORT` dinámico, por defecto `8081`.

## Variables de Entorno

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `PORT`

## Flujo de petición

1. El gateway BFF del frontend envía `/api/auth/...`.
2. `AuthController` recibe la petición.
3. `AuthService` ejecuta la lógica.
4. `UserRepository` accede a la base de datos.
5. Se devuelve respuesta JSON al frontend.

## Integración

- El frontend se comunica con este servicio a través del gateway en `frontend/app/api/gateway/[...path]/route.ts`.
- No hay llamadas directas a otros microservicios dentro del repositorio.

