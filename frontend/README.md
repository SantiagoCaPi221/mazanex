# Innovatech  - Frontend (Next.js Web Application)

Innovatech es una plataforma web interactiva diseñada bajo una arquitectura de microservicios que combina la gestión comunitaria, la personalización de perfiles y la gamificación en tiempo real. La interfaz ofrece una experiencia de usuario dinámica, fluida y completamente adaptativa.

## Características Principales

El frontend expone los siguientes módulos funcionales accesibles desde el entorno local:

* **Gestión de Accesos (Autenticación):** Sistema completo de registro de nuevos usuarios e inicio de sesión seguro, conectado directamente con el servicio de autenticación centralizado (`ms-auth`).
* **Módulo de Comunidad:** Espacio dedicado para la visualización global de todas las publicaciones de la plataforma, actuando como el canal principal de interacción (`ms-publications`).
* **Gamificación y Tablas de Clasificación (Ranking):** Integración de un videojuego interactivo (*Snake Game*) que cuenta con un panel lateral dinámico en la vista de comunidad para mostrar el ranking de puntuaciones en tiempo real (`ms-ranking`).
* **Perfiles Altamente Personalizables:** Un apartado privado de perfil donde el usuario autenticado puede gestionar su identidad visual de manera avanzada, permitiendo modificar en tiempo real su foto de perfil, la imagen del banner superior y la imagen de fondo de la interfaz (`ms-profile`).



## Arquitectura de Directorios

El frontend sigue una estructura modular basada en el App Router de Next.js, diseñada para una clara separación de responsabilidades:

```text
frontend/
├── app/
│   ├── clients/       # Clientes HTTP (Axios) para consumo del API Gateway
│   ├── components/    # Componentes UI reutilizables (Recharts, Modales, etc.)
│   ├── config/        # Centralización de endpoints y configuración
│   ├── context/       # Manejo de estados de contexto
│   ├── pages/         # Vistas: login, registro, comunidad, ranking y perfil
│   ├── store/         # Estado global (Zustand) para persistencia de sesión
│   └── layout.tsx     # Layout raíz de la aplicación
├── k8s/               # Manifiestos para despliegue en Kubernetes
├── public/            # Archivos estáticos y assets
├── Dockerfile         # Configuración de imagen (Node.js Alpine)
└── package.json       # Scripts y dependencias