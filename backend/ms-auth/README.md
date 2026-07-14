# Readme Auth Service

## 1. Descripción

Microservicio de autenticación y gestión de usuarios para Mazanex.


## 2. Responsabilidades

- Registrar usuarios.
- Iniciar sesión.
- Listar usuarios.
- Actualizar perfil.
- Cambiar contraseña.
- Eliminar cuentas.

## 3. Arquitectura de software

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

## 4. Endpoints Principales

| Método | Endpoint | Función |
|---|---|---|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/users` | Listar usuarios |
| PUT | `/api/auth/profile/{id}` | Actualizar perfil |
| PUT | `/api/auth/{id}/password` | Cambiar contraseña |
| DELETE | `/api/auth/{id}` | Eliminar usuario |

## 5. Tecnologías

| Tecnología | Versión |
|------------|---------|
| Java | 17 LTS |
| Spring Boot | 3.4.5 |
| Spring Data JPA | Incluida |
| JWT (JJWT) | 0.9.1 |
| H2 Database | Latest (dev) |
| MySQL Connector | Latest (prod) |
| SpringDoc OpenAPI | 2.1.0 |
| Lombok | Latest |
| Maven | 3.8.1+ |


## 6. Seguridad

| Capa | Tecnología |
|---|---|
| Lenguaje | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Persistencia | Spring Data JPA, MySQL Connector/J |
| Compilación | Maven |
| Docker | Docker multi-stage |

## 7. Seguridad
- **CORS**: Habilitado para integración con frontend
- No hay generación ni validación de JsonWebToken
Las contraseñas se comparan en texto plano, y se valida con una función dentro del código que valida 8 caracteres,  al menos 1 mayuscula, al menos 1 minuscula, almenos 1 número y un simbolo.

 **Recomendaciones para mejorar:**

- Implementar BCryptPasswordEncoder para hashear contraseñas
- Añadir filtro JWT para proteger endpoints sensibles
- Propagar tokens JWT desde el BFF hacia aquí


## 8. Base de Datos

- Tabla principal: `users`.
- Entidad `User` incluye: `id`, `name`, `email`, `password`, `role`, `avatarUrl`, `bannerUrl`, `bio`, `backgroundUrl`.
- Configuración en `src/main/resources/application.properties` usa variables de entorno MySQL.

## 9. Contenedorización

- Dockerfile con build multi-stage.
- Base de imagen: Maven 3.8.5 + OpenJDK 17.
- Runtime: Eclipse Temurin 17 Alpine.
- El servicio usa `PORT` dinámico, por defecto `8081`.

## 10. Variables de Entorno

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `PORT`

## 11. Flujo de petición

1. El gateway BFF del frontend envía `/api/auth/...`.
2. `AuthController` recibe la petición.
3. `AuthService` ejecuta la lógica.
4. `UserRepository` accede a la base de datos.
5. Se devuelve respuesta JSON al frontend.

## 12. Swagger Auth 
Link swagger: https://fullstack4-auth-production-7c66.up.railway.app/swagger-ui/index.html#/
<img width="1900" height="1036" alt="image" src="https://github.com/user-attachments/assets/f9e27112-c19e-4c7b-9ce5-f686d36de750" />

## 13. Navegación

- **Volver al Inicio:** [Contexto de Negocio](../../README.md)
- **Raíz del Backend:** [Arquitectura General](../README.md)
- **Ir al Frontend:** [Configuración de Cliente](../../frontend/README.md)
- **Perfil:** [Microservicio Perfil](../ms-profile/README.md)

## 14. Documentación y seguimiento de errores

- **Javadocs:** Generar la documentación de la API Java con Maven usando `mvn javadoc:javadoc`. Los archivos resultantes se generan en `target/site/apidocs`. Se recomienda añadir un paso en el CI que publique los Javadocs (por ejemplo, en GitHub Pages o en el servidor de artefactos usado por el equipo).

- **GlitchTip (gestión de errores):** Se puede integrar GlitchTip (compatible con Sentry) para capturar excepciones y trazas en tiempo de ejecución. Configure la DSN del proyecto en la variable de entorno `SENTRY_DSN` (o `GLITCHTIP_DSN` según su despliegue) y utilice un cliente compatible (por ejemplo `io.sentry:sentry-spring-boot-starter`) para enviar errores. En `application.properties` puede añadirse la configuración básica:

```
# Ejemplo mínimo
sentry.dsn=${SENTRY_DSN:}
sentry.environment=${ENV:local}
```

Documentar en el equipo cómo obtener la DSN del proyecto GlitchTip y qué eventos deben enviarse (errores no manejados, errores 5xx, etc.).
