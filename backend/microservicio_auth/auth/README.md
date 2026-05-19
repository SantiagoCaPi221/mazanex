# Auth Service

## Descripción

Microservicio de autenticación y gestión de usuarios para Mazanex.

## 1. Responsabilidades

- Registrar usuarios.
- Iniciar sesión.
- Listar usuarios.
- Actualizar perfil.
- Cambiar contraseña.
- Eliminar cuentas.

## 2. Arquitectura de software

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

## 3. Endpoints Principales

| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/users` | Listar usuarios |
| PUT | `/api/auth/profile/{id}` | Actualizar perfil |
| PUT | `/api/auth/{id}/password` | Cambiar contraseña |
| DELETE | `/api/auth/{id}` | Eliminar usuario |

## 4. Tecnologías Utilizadas

| Capa | Tecnología |
|---|---|
| Lenguaje | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Persistencia | Spring Data JPA, MySQL Connector/J |
| Compilación | Maven |
| Docker | Docker multi-stage |

## 5. Seguridad
- **CORS**: Habilitado para integración con frontend
- No hay generación ni validación de JsonWebToken
Las contraseñas se comparan en texto plano, y se valida con una función dentro del código que valida 8 caracteres,  al menos 1 mayuscula, al menos 1 minuscula, almenos 1 número y un simbolo.

 **Recomendaciones para mejorar:**

- Implementar BCryptPasswordEncoder para hashear contraseñas
- Añadir filtro JWT para proteger endpoints sensibles
- Propagar tokens JWT desde el BFF hacia aquí


## 5. Base de Datos

- Tabla principal: `users`.
- Entidad `User` incluye: `id`, `name`, `email`, `password`, `role`, `avatarUrl`, `bannerUrl`, `bio`, `backgroundUrl`.
- Configuración en `src/main/resources/application.properties` usa variables de entorno MySQL.

## 6. Contenedorización

- Dockerfile con build multi-stage.
- Base de imagen: Maven 3.8.5 + OpenJDK 17.
- Runtime: Eclipse Temurin 17 Alpine.
- El servicio usa `PORT` dinámico, por defecto `8081`.

## 7. Variables de Entorno

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `PORT`

## 8. Flujo de petición

1. El gateway BFF del frontend envía `/api/auth/...`.
2. `AuthController` recibe la petición.
3. `AuthService` ejecuta la lógica.
4. `UserRepository` accede a la base de datos.
5. Se devuelve respuesta JSON al frontend.

## 9. Swagger Auth 
Link swagger: https://fullstack4-auth-production-7c66.up.railway.app/swagger-ui/index.html#/
<img width="1900" height="1036" alt="image" src="https://github.com/user-attachments/assets/f9e27112-c19e-4c7b-9ce5-f686d36de750" />

## 10. Integración

- El frontend se comunica con este servicio a través del gateway en `frontend/app/api/gateway/[...path]/route.ts`.
- No hay llamadas directas a otros microservicios dentro del repositorio.

