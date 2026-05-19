# Frontend — Mazanex

## 1. Descripción

Interfaz web desarrollada con Next.js y TypeScript para acceso de usuarios, gestión de perfiles y comunidad de juego.

## 2. Funcionalidades

- Login y registro de usuarios.
- Edición de perfil.
- Comunidad de jugadores con estado de relación.
- Visualización de rankings y puntajes.
- Rutas dinámicas de usuario.

## 3. Arquitectura

- `app/`: páginas y rutas del proyecto.
- `components/`: componentes reutilizables de UI.
- `service/`: integración con backend mediante el gateway.
- `context/`: manejo de estado para auth y perfil.
- `store/`: persistencia de usuario con Zustand.
- `config/endpoints.ts`: URLs de backend.
- `app/api/gateway/[...path]/route.ts`: gateway BFF.

## 4. Páginas principales

- `/login`
- `/register`
- `/profile`
- `/community`
- `/user/[id]`

## 5. Librerías principales

- `next` / `react` / `react-dom`
- `typescript`
- `tailwindcss`
- `zustand`
- `lucide-react`

## 6. Gateway y backend

El frontend usa un BFF en `app/api/gateway/[...path]/route.ts` que reenvía llamadas a:

- `backend/auth` para autenticación.
- `backend/profile` para perfil, comunidad y puntajes.

Los servicios destino se configuran en `frontend/config/endpoints.ts`.

## 7. Estructura simplificada

```text
frontend/
├── app/
│   ├── api/gateway/[...path]/route.ts
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── profile/page.tsx
│   ├── community/page.tsx
│   └── user/[id]/page.tsx
├── components/
├── config/endpoints.ts
├── context/
├── service/
└── store/useUserStore.ts
```

## 8. Navegación

* **Volver al Inicio:** [Contexto de Negocio](../README.md)
* **Ir al Backend:** [Arquitectura de Microservicios](../backend/README.md)
    * **Componente:** [Microservicio Auth](../backend/microservicio_auth/auth/README.md)
    * **Componente:** [Microservicio Perfil](../backend/microservicio_profile/profile/README.md)
