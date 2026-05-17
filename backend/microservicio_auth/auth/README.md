# Microservicio — Auth

---

## 1. ¿Qué hace?

Servicio de autenticación y gestión de usuarios con Spring Boot. Responsable de:
- Registro de nuevos usuarios
- Validación de credenciales (login)
- Edición de perfil de usuario
- Cambio de contraseña
- Eliminación de usuario

---

## 2. Arquitectura

- `AuthController`: maneja solicitudes HTTP
- `AuthService`: contiene la lógica de negocio
- `UserRepository`: acceso a datos con Spring Data JPA
- MySQL: base de datos de usuarios

---

## 3. Endpoints principales

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/users` | Listar todos los usuarios |
| PUT | `/api/auth/profile/{id}` | Actualizar perfil del usuario |
| PUT | `/api/auth/{id}/password` | Cambiar contraseña |
| DELETE | `/api/auth/{id}` | Eliminar usuario |

---

## 4. Tecnologías

- Spring Boot 3.2.x · Spring Web · Spring Data JPA
- MySQL Connector/J · Lombok
- `springdoc-openapi` para documentación
- `io.jsonwebtoken:jjwt` disponible en dependencias (no usado aún)

---

## 5. Seguridad hoy

**Estado actual:**
- No hay generación ni validación de JWT
- Las contraseñas se comparan en texto plano

**Recomendaciones para mejorar:**
- Implementar `BCryptPasswordEncoder` para hashear contraseñas
- Añadir filtro JWT para proteger endpoints sensibles
- Propagar tokens JWT desde el BFF hacia aquí

---

## 6. Cómo ejecutar

**Local (desarrollo):**
```bash
cd backend/microservicio_auth/auth
./mvnw spring-boot:run
```

**Con Docker Compose:**
```bash
cd backend
docker-compose up --build
```

---

## 7. Para presentación

- Demostrar el flujo de registro → login
- Ejecutar `GET /api/auth/users` para mostrar la respuesta JSON
- Destacar que está listo para agregar seguridad JWT en los próximos pasos

