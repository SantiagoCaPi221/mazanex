# Frontend — Mazanex

---

## 1. ¿Qué es?

Frontend web de Mazanex creado con Next.js y TypeScript. Ofrece:
- login y registro
- perfil de usuario
- comunidad social
- integración con los microservicios backend

---

## 2. Organización del frontend

- `app/`: rutas y página principal
- `components/`: UI reutilizable
- `service/`: llamadas API al backend
- `context/`: estado global (auth, perfil)
- `store/`: persistencia local con Zustand
- `app/api/gateway/[...path]/route.ts`: gateway BFF

---

## 3. Cómo funciona

1. El usuario navega en el frontend.
2. Las llamadas al backend pasan por `/api/gateway`.
3. El gateway reenvía a Auth o Profile.
4. El frontend recibe JSON y actualiza la UI.

---

## 4. Puntos importantes

- El gateway está en `app/api/gateway/[...path]/route.ts`.
- Los endpoints actuales se configuran en `frontend/config/endpoints.ts`.
- El usuario se mantiene en `localStorage`.
- Hoy no hay un manejo JWT centralizado en el frontend.
- Recomendado: mover los endpoints a variables de entorno y añadir `Authorization` cuando el backend lo soporte.

---

## 5. Tecnologías

- Next.js 15 · React 19 · TypeScript
- Tailwind CSS · Zustand

---

## 6. Cómo ejecutar

```bash
cd frontend
pnpm install
pnpm dev
```

Abrir `http://localhost:3000`.

---

## 7. Sugerencia para presentación

- Mostrar login y perfil en la UI.
- Abrir la consola de red y señalar las llamadas al gateway.
- Explicar que el frontend ya está listo para agregar JWT y mover configuraciones a env vars.
