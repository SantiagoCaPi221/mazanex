# Readme Contexto/Negocio 

## Contexto

Mazanex es una plataforma que reúne identidad de usuario, perfiles sociales y puntajes de juego en un solo entorno web.

## Introducción

El sistema responde a la necesidad de ofrecer registro, perfil y comunidad para jugadores sin mezclar la lógica de frontend y backend.

## Solución

Mazanex implementa:
- registro y login de usuarios,
- edición de perfiles,
- gestión de comunidad y solicitudes sociales,
- seguimiento de puntajes y rankings.

## Requerimientos funcionales

- Crear y autenticar usuarios.
- Actualizar datos de perfil.
- Consultar perfiles públicos.
- Enviar y aceptar solicitudes sociales.
- Guardar y consultar puntajes de juego.
- Mostrar notificaciones de actividad.

## Requerimientos no funcionales

- Interfaz desarrollada en Next.js y TypeScript.
- Backend modular con servicios independientes.
- Persistencia en MySQL.
- Comunicación REST en JSON.
- Contenerización con Docker.

## Casos de uso

- Registro de un nuevo jugador.
- Inicio de sesión y acceso a perfil.
- Edición de avatar, bio y banner.
- Interacción social entre usuarios.
- Consulta de rankings por juego.

## Arquitectura del sistema

- Frontend en `frontend/`.
- Gateway BFF en `frontend/app/api/gateway/[...path]/route.ts`.
- Auth Service en `backend/microservicio_auth/auth`.
- Profile Service en `backend/microservicio_profile/profile`.
- MySQL como base de datos compartida.

El gateway BFF recibe las peticiones del frontend y las dirige a Auth o Profile según la ruta.

## Componentes principales

- Frontend: UI y gateway.
- Auth Service: `/api/auth`.
- Profile Service: `/api/profile`, `/api/profile/social`, `/api/profile/games`.
- MySQL: persistencia de datos.
- Docker Compose: orquestación local.

## Flujo general del sistema

1. El usuario usa la aplicación web.
2. La UI envía la petición al gateway interno.
3. El gateway reenvía la petición al servicio correcto.
4. El servicio procesa la solicitud.
5. La respuesta regresa en JSON.
6. La UI muestra el resultado.

## Estructura del proyecto

```text
/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── service/
│   └── store/
└── backend/
    ├── docker-compose.yml
    ├── microservicio_auth/auth/
    └── microservicio_profile/profile/
```

## Ejecución

```bash
cd frontend
pnpm install
pnpm dev
```

```bash
cd backend
docker-compose up --build
```

## Variables de entorno

- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `PORT`

## Conclusión

Mazanex es un sistema modular para comunidad gamer que separa frontend y backend mediante un gateway BFF. Este README está enfocado en el contexto del negocio, la solución y la arquitectura real del proyecto.
