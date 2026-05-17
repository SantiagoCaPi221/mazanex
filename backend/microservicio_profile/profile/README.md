# Microservicio — Profile

---

## 1. ¿Qué hace?

Servicio de perfiles y comunidad para Mazanex. Controla:
- perfiles de usuario
- sincronización y creación desde Auth
- solicitudes de amistad y seguidores
- notificaciones sociales
- puntajes, rankings y reportes de juego

---

## 2. Organización

- `ProfileController`, `SocialController`, `GameController`
- `ProfileService`, `SocialService`, `GameService`
- Repositorios JPA para usuarios, puntajes, notificaciones, seguidores y solicitudes
- MySQL para persistencia

---

## 3. Endpoints principales

| Método | Ruta | Qué hace |
|---|---|---|
| PUT | `/api/profile/{id}` | Actualiza un perfil |
| POST | `/api/profile/sync` | Sincroniza o crea un perfil |
| GET | `/api/profile/list` | Lista perfiles |
| DELETE | `/api/profile/{id}` | Elimina un perfil |
| POST | `/api/profile/games/save-record` | Guarda un récord |
| GET | `/api/profile/games/user/{id}` | Obtiene puntajes de un usuario |
| GET | `/api/profile/games/ranking/{game}` | Ranking por juego |
| POST | `/api/profile/games/report/{id}` | Reporta un puntaje |
| POST | `/api/profile/social/send-request/{senderId}/{receiverId}` | Envía solicitud de amistad |
| POST | `/api/profile/social/accept-request/{senderId}/{receiverId}` | Acepta solicitud |
| GET | `/api/profile/social/status/{idA}/{idB}` | Estado de relación |
| GET | `/api/profile/social/following/{id}` | Usuarios seguidos |
| GET | `/api/profile/social/notifications/{userId}` | Notificaciones |

---

## 4. Tecnologías

- Spring Boot 3.2.x · Spring Web · Spring Data JPA
- MySQL Connector/J · Lombok

---

## 5. Seguridad actual

- No hay validación JWT ni autorización por roles.
- Recomendado: proteger endpoints sensibles y propagar tokens desde el frontend/BFF.

---

## 6. Cómo ejecutar

Local:
```bash
cd backend/microservicio_profile/profile
./mvnw spring-boot:run
```

Con Docker Compose:
```bash
cd backend
docker-compose up --build
```

---

## 7. Nota importante

Verificar que `backend/docker-compose.yml` apunte a la carpeta correcta del servicio, ya que la ruta real en este repositorio es `microservicio_profile/profile`.

---

## 8. Para presentación

- Mostrar cómo se crean perfiles y se consultan rankings.
- Explicar que hoy el servicio ya funciona, pero falta añadir JWT y proteger mejor las APIs.

