# Sistema de Gestión de Proyectos - Innovatech

## Descripción

Innovatech es una plataforma de gestión de proyectos basada en arquitectura de microservicios. Permite administrar tareas, usuarios, recursos y métricas, mejorando la organización del trabajo y la visibilidad del estado de los proyectos.

El sistema está diseñado para ser escalable, seguro y fácil de mantener.

---

## Arquitectura

La solución se basa en microservicios desplegados en un entorno orquestado. Cada componente cumple una función específica y se comunica mediante APIs REST sobre HTTPS utilizando JSON.

### Componentes principales

#### Frontend
- Desarrollado con Next.js 14 y TypeScript  
- Permite la interacción de los usuarios con el sistema  
- Consume los servicios backend mediante HTTPS  

#### API Gateway
- Implementado con KrakenD  
- Centraliza las solicitudes del cliente  
- Valida tokens JWT  
- Enruta las peticiones a los microservicios  

#### Microservicios (Backend)
Desarrollados en Java 21 con Spring Boot:

- **Project Service**
  - Gestión de proyectos y tareas  

- **Resource Service**
  - Gestión de recursos y disponibilidad  

- **Auth Service**
  - Autenticación de usuarios  
  - Generación de JWT  
  - Control de acceso basado en roles (RBAC)  

- **Analytics Service**
  - Generación de métricas e indicadores (KPI)  

#### Base de datos
- PostgreSQL 16  
- Cada microservicio posee su propia base de datos  

#### Contenedores y Orquestación
- Docker para empaquetar los servicios  
- Kubernetes para despliegue, escalabilidad y alta disponibilidad  

---

## Seguridad

El sistema implementa:

- Autenticación mediante JWT  
- Autorización basada en roles (RBAC)  
- Validación de tokens en el API Gateway  
- Comunicación segura mediante HTTPS  

---

## Tecnologías utilizadas

| Tecnología     | Versión |
|----------------|--------|
| Java           | 21 (LTS) |
| Spring Boot    | 3.x |
| PostgreSQL     | 16 |
| KrakenD        | 2.x |
| Next.js        | 14 |
| TypeScript     | 5.x |
| Docker         | Última |
| Kubernetes     | Última |

---

## Funcionamiento general

1. El usuario interactúa con el frontend  
2. Las solicitudes se envían al API Gateway  
3. El Gateway valida el token JWT  
4. La solicitud se redirige al microservicio correspondiente  
5. El microservicio procesa la información y responde en formato JSON  

---

## Características del sistema

- Arquitectura desacoplada  
- Escalabilidad horizontal  
- Alta disponibilidad  
- Seguridad centralizada  
- Resiliencia ante fallos  

---

## Estructura de los microservicios

Cada microservicio sigue una estructura estándar:

- Controller: manejo de solicitudes HTTP  
- Service: lógica de negocio  
- Repository: acceso a datos  
- Entity: modelo de base de datos  
- DTO: transferencia de datos  

---

## Diagrama de Contenedores

>
> <img width="1919" height="2925" alt="Diagrama de contenedores  (1)" src="https://github.com/user-attachments/assets/82afb61c-b1fd-4fb1-9d3b-dd2d795040c3" />


---

## Conclusión

La arquitectura basada en microservicios permite construir un sistema flexible, escalable y mantenible. La separación de responsabilidades, junto con el uso de tecnologías modernas, facilita la evolución del sistema y su adaptación a nuevas necesidades.
