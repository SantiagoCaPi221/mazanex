# Innovatech – Sistema Empresarial de Autenticación y Gestión de Perfiles

---

## 1. Descripción General

**Innovatech** es una plataforma empresarial desarrollada bajo una arquitectura basada en **microservicios desacoplados**, diseñada para gestionar de forma segura el registro, autenticación y administración de perfiles de usuario.

El sistema integra:
- Un **Frontend moderno**
- Un **API Gateway**
- Microservicios independientes
- Bases de datos separadas por servicio
- Contenedores para despliegue

La arquitectura fue diseñada siguiendo principios de ingeniería de software como bajo acoplamiento, alta cohesión, escalabilidad y seguridad por ocultación de infraestructura.

---

## 2. Arquitectura del Sistema

La solución está compuesta por múltiples capas que se comunican mediante **APIs REST** utilizando formato **JSON**.

### Frontend (Next.js + BFF)
- Interfaz de usuario desarrollada con **Next.js**
- Gestión de estado en el cliente
- Implementación del patrón **Backend For Frontend (BFF)**
- Comunicación segura con el API Gateway
- Encargado de la experiencia de usuario

---

### API Gateway (KrakenD)
- Punto único de entrada al sistema
- Funciona como **proxy inverso**
- Centraliza y enruta solicitudes hacia los microservicios
- Refuerza la seguridad perimetral
- Oculta la infraestructura interna

---

### Microservicios Backend (Spring Boot)
Desarrollados en **Java con Spring Boot**. El sistema está compuesto por:

#### Servicio de Autenticación
- Registro de usuarios
- Inicio de sesión
- Generación y validación de **JWT**
- Control de acceso basado en roles (**RBAC**)

#### Servicio de Perfil
- Consulta de datos del usuario
- Actualización de información mediante operaciones HTTP
- Gestión independiente de datos personales

Cada microservicio funciona de manera autónoma.

---

### Base de Datos
- Motor relacional **MySQL**
- Esquemas separados por microservicio
- Cumplimiento de propiedades **ACID**
- Despliegue en entorno cloud

---

### Infraestructura y Despliegue
- Uso de **Docker**
- Contenedores independientes por servicio
- Preparado para despliegue en entornos escalables
- Arquitectura orientada a la nube

---

## 3. Seguridad

El sistema implementa múltiples mecanismos de protección:
- Autenticación mediante **JWT**
- Autorización basada en roles (**RBAC**)
- Validación de tokens en el API Gateway
- Comunicación segura mediante **HTTPS**
- Separación de responsabilidades entre servicios

---

## 4. Tecnologías Utilizadas

| Componente | Tecnología |
|------------|------------|
| Frontend | Next.js |
| Backend | Spring Boot |
| Lenguaje Backend | Java |
| Base de Datos | MySQL |
| API Gateway | KrakenD |
| Contenedores | Docker |

---

## 5. Flujo General del Sistema

1. El usuario interactúa con el **Frontend**.
2. Las solicitudes se envían al **API Gateway**.
3. El Gateway valida el token **JWT**.
4. La solicitud se redirige al microservicio correspondiente.
5. El microservicio procesa la información.
6. La respuesta se devuelve en formato **JSON**.

---

## 6. Diagrama de Contenedores (Diseño General)

El siguiente modelo representa la infraestructura completa y la convivencia de los componentes distribuidos de la plataforma:

> <img width="1919" height="2925" alt="Diagrama de contenedores  (1)" src="https://github.com/user-attachments/assets/82afb61c-b1fd-4fb1-9d3b-dd2d795040c3" />

---

## 7. Estructura del Repositorio (Monorepo)

El proyecto está organizado de forma centralizada en módulos independientes dentro de la raíz principal:

```text
FULLSTACK-4 (Raiz del Monorepo)
├── frontend/      --> Codigo y logica de la interfaz de usuario del cliente.
└── backend/       --> Entorno que aloja los microservicios independientes.
├── auth/      --> Microservicio dedicado a la seguridad y login.
└── perfil/    --> Microservicio dedicado a los datos de usuario.
```
## 🧭 8. Documentación Detallada por Áreas

### 💻 [Revisar el Módulo de FRONTEND ──►](./frontend/README.md)

### ⚙️ [Revisar el Módulo de BACKEND ──►](./backend/README.md)
