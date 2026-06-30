# Mazanex Frontend

Este directorio contiene la interfaz web de Mazanex, construida con Next.js y React. La aplicación funciona como capa de experiencia de usuario para los microservicios del backend y ofrece autenticación, comunidad, perfil, ranking y vistas de interacción con juegos.

## Qué incluye el frontend

El frontend actual ofrece las siguientes áreas principales:

- Autenticación y registro de usuarios
- Inicio de sesión persistente con almacenamiento local del usuario
- Comunidad con muro, descubrimiento de usuarios, gestión de amigos y feed social
- Ranking global y visualización de resultados por juego
- Perfil personalizado con edición de nombre, biografía, avatar, banner y fondo
- Notificaciones y manejo de estado global para sesión y UI
- Vistas de dashboard y navegación principal para el usuario autenticado

## Tecnologías utilizadas

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand para estado global
- Axios para consumo de APIs
- Recharts para visualización de datos
- Lucide React para iconos
- ESLint y Next.js linting

## Estructura del proyecto

```text
frontend/
├── app/
│   ├── clients/        # Servicios para consumir APIs del backend
│   ├── components/     # Componentes UI reutilizables y hooks
│   ├── config/         # Configuración de endpoints y variables base
│   ├── context/        # Contextos de autenticación y perfil
│   ├── pages/          # Vistas principales del sistema
│   ├── store/          # Store global con Zustand
│   ├── layout.tsx      # Layout raíz de la app
│   └── page.tsx        # Página de inicio / landing
├── k8s/                # Manifiestos de despliegue Kubernetes
├── public/             # Archivos estáticos
├── Dockerfile          # Imagen de contenedor para el frontend
├── package.json        # Scripts y dependencias
├── pnpm-lock.yaml      # Lockfile de pnpm
└── tsconfig.json       # Configuración de TypeScript
```

## Rutas principales

La aplicación expone estas vistas principales:

- `/` — Landing page de bienvenida
- `/pages/login` — Inicio de sesión
- `/pages/register` — Registro de usuarios
- `/pages/community` — Comunidad, usuarios, feed y ranking
- `/pages/profile` — Perfil del usuario
- `/pages/dashboard` — Vista de dashboard/proyectos
- `/pages/user/[id]` — Perfil público de otro usuario

## Requisitos previos

Antes de ejecutar el frontend, asegúrate de tener instalado:

- Node.js 20 o superior
- pnpm 9 o superior

## Instalación

Desde la raíz del proyecto:

```bash
cd frontend
pnpm install
```

## Variables de entorno

Crea un archivo `.env.local` dentro de la carpeta `frontend` con al menos:

```env
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
```

Esta URL se utiliza para apuntar a la puerta de entrada del backend y a los microservicios expuestos por el gateway.

## Scripts disponibles

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

### Comandos útiles

- `pnpm dev`: inicia la aplicación en modo desarrollo con Turbopack
- `pnpm build`: genera la build de producción
- `pnpm start`: levanta la app compilada en modo producción
- `pnpm lint`: valida el código con ESLint

## Integración con el backend

El frontend consume servicios del backend a través de los clientes ubicados en `app/clients/`:

- `authService` — autenticación y registro
- `profileService` — gestión de perfil
- `publicationService` — publicaciones de la comunidad
- `gameService` — ranking y reportes de evidencia
- `socialService` — relaciones entre usuarios

Los endpoints base se centralizan en `app/config/endpoints.ts`.

## Ejecución local

Para correr la interfaz localmente:

```bash
cd frontend
pnpm dev
```

Luego abre:

```text
http://localhost:3000
```

Es recomendable tener levantado también el backend y el gateway para que la UI pueda consumir correctamente los servicios.

## Despliegue

El proyecto incluye:

- `Dockerfile` para construir una imagen del frontend
- carpetas `k8s/` con manifiestos para despliegue en Kubernetes

Ejemplo de construcción de imagen:

```bash
docker build -t mazanex-frontend .
```

## Notas generales

El frontend está pensado para funcionar como una experiencia moderna, responsiva y conectada a los servicios de Mazanex. Su arquitectura modular facilita la escalabilidad y la integración con nuevos módulos de negocio en el futuro.