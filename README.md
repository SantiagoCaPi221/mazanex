# Readme Contexto/Negocio 

1. Contexto
Mazanex es una plataforma integral diseñada bajo una arquitectura de microservicios, enfocada en la gestión de identidad, perfiles sociales, proyectos técnicos y sistemas de ranking competitivos para jugadores.

2. Introducción
El sistema evoluciona de un entorno local de desarrollo a una infraestructura Cloud-Native orquestada mediante Kubernetes (K8s), permitiendo alta disponibilidad, resiliencia y escalabilidad independiente de los servicios.

3. Arquitectura del Sistema
El sistema utiliza el patrón Backend For Frontend (BFF) implementado mediante KrakenD, el cual centraliza el ruteo, la seguridad y la orquestación de peticiones, desacoplando el frontend de la complejidad del backend.

Componentes de la Arquitectura:
API Gateway (BFF): KrakenD gestiona el tráfico, CORS y ruteo a servicios internos.

Microservicios (Backend):

ms-auth: Gestión de identidades, JWT y seguridad.

ms-profile: Gestión de perfiles y relaciones sociales.

ms-projects: Seguimiento de proyectos y tareas técnicas.

ms-publications: Sistema de feeds, likes y comentarios.

ms-ranking: Sistema de récords y tablas de clasificación.

Persistencia: Instancias independientes de MySQL por cada microservicio, garantizando el desacoplamiento de datos.

Orquestación: Despliegue gestionado mediante Kubernetes, utilizando kubectl para la administración de manifiestos y recursos.

4. Requerimientos no funcionales
Frontend: Next.js, TypeScript y TailwindCSS.

Backend: Java 17, Spring Boot, Spring Cloud.

Infraestructura: Docker y Kubernetes (K8s).

CI/CD: Pipeline automatizado con GitHub Actions usando Matrix Strategy para pruebas paralelas.

5. Estructura del Proyecto
```plaintext
/
├── frontend/             # Interfaz web (Next.js)
├── backend/              # Microservicios (Java/Spring Boot)
│   ├── ms-auth/
│   ├── ms-profile/
│   ├── ms-projects/
│   ├── ms-publications/
│   └── ms-ranking/
└── k8s-all/              # Manifests de Kubernetes (ConfigMaps, Deployments, Services)
```
7. Ejecución
Dependiendo de tus necesidades de desarrollo, puedes levantar Mazanex mediante dos vías:

A. Entorno de Desarrollo Rápido (Docker Compose)
Ideal para cambios rápidos en el código y pruebas locales sin la complejidad de K8s.

Bash
# Levantar todos los servicios definidos en el archivo docker-compose
docker compose up --build
B. Entorno de Orquestación (Kubernetes)
Ideal para validar la resiliencia, escalabilidad y configuración del clúster antes de producción.

Aplicar manifiestos:

Bash
kubectl apply -k k8s-all/
Exponer servicios para acceso local (Port-Forwarding):

Bash
# BFF (Backend)
kubectl port-forward svc/bff-service 8080:8080 -n mazanex

# Frontend
kubectl port-forward svc/frontend-service 3000:80 -n mazanex

7. Flujo de Comunicación
El usuario interactúa con la UI (Next.js).

Las peticiones son enviadas al BFF (KrakenD) en el puerto 8080.

El Gateway autentica y rutea la petición al servicio interno correspondiente (ms-auth, ms-ranking, etc.).

Cada servicio consulta su base de datos independiente.

La respuesta es devuelta en JSON al frontend.

8. Navegación del Proyecto
Documentación Global: Contexto de Negocio (Este archivo)

Frontend: Configuración y Vistas

Backend: Arquitectura de Microservicios

Infraestructura: Configuración Kubernetes
