#  Innovatech - Plataforma de Gestión Empresarial e Identidades

---

## 📝 1. Descripción General
**Innovatech** es una solución de software empresarial diseñada bajo una arquitectura distribuida y moderna. El objetivo principal del sistema es centralizar, automatizar y proteger el flujo de accesos e identidades dentro de una organización, asegurando que la entrada a las plataformas corporativas sea ágil para los colaboradores y completamente segura para los activos de información de la empresa.

---

##  2. Alcance del Proyecto (Fase 1 - MVP)
Siguiendo las metodologías ágiles de la industria para el despliegue continuo de software, el proyecto se estructuró bajo la estrategia de un **MVP (Producto Mínimo Viable)**. 

Para cumplir rigurosamente con los alcances estratégicos acordados para esta fase, el sistema se enfoca al 100% en tres capacidades operativas nucleares:
* **Registro de Usuarios:** Captura y validación automatizada de nuevas cuentas corporativas.
* **Inicio de Sesión Seguro (Login):** Autenticación perimetral de usuarios registrados mediante credenciales de acceso.
* **Gestión de Perfil:** Módulo de autogestión donde el colaborador puede visualizar su información y actualizar sus datos personales o imagen.

---

##  3. Arquitectura General del Sistema
El sistema rompe con el esquema tradicional de los monolitos mediante un **desacoplamiento absoluto**, dividiendo sus responsabilidades en cuatro capas estratégicas que trabajan de forma armónica:

* **Frontend (Capa Cliente):** Es la interfaz gráfica e interactiva con la que operan los usuarios finales, optimizada para ofrecer respuestas en tiempo real y sin recargas de pantalla.
* **API Gateway (Capa Perimetral):** Actúa como el Proxy Inverso y único punto de entrada público. Se encarga de unificar las solicitudes, ocultar la infraestructura interna de la empresa y enrutar el tráfico de forma inteligente.
* **Backend (Capa de Servicios):** Servidores independientes (microservicios) que ejecutan las reglas lógicas del negocio y procesan la seguridad de manera aislada en la nube de Railway.
* **Base de Datos (Capa de Persistencia):** Espacios relacionales independientes para garantizar que cada módulo almacene su información de forma confidencial, limpia y bajo estándares estables.

### 🗺️ Plan Arquitectónico Proyectado
El siguiente diagrama detalla la proyección general de Innovatech con sus 4 microservicios originales (`Auth`, `Perfil/Resource`, `Project` y `Analytics`). Para efectos del alcance operativo de esta entrega, el desarrollo se concentró con total fidelidad en los servicios de **Auth** y **Perfil**:

> <img width="1919" height="2925" alt="Diagrama de contenedores" src="https://github.com/user-attachments/assets/82afb61c-b1fd-4fb1-9d3b-dd2d795040c3" />

---

##  4. Tecnologías Utilizadas
La matriz tecnológica de la plataforma selecciona herramientas estándar de la industria para asegurar robustez y escalabilidad:

* **Java 21 (LTS):** Lenguaje base del servidor para el procesamiento seguro de datos.
* **Spring Boot 3.x:** Framework corporativo para el despliegue ágil de los microservicios.
* **Node.js & Next.js 14:** Entorno y framework moderno para la construcción de la interfaz web reactiva.
* **MySQL 8.x:** Motor de base de datos relacional para asegurar transacciones consistentes y organizadas.
* **KrakenD:** API Gateway de alto rendimiento para el enrutamiento y protección perimetral.
* **Railway:** Plataforma en la nube utilizada para el hospedaje y disponibilidad de los servicios en producción.

---

##  5. Cómo Ejecutar el Proyecto (Vistazo General)
Para levantar el ecosistema completo de Innovatech en un entorno de desarrollo local, se deben seguir estos pasos macros:

1.  **Clonar el Repositorio:** Descargar el monorepo completo en tu máquina local.
2.  **Configurar las Bases de Datos:** Asegurar tener instancias de MySQL corriendo con las credenciales correspondientes para los servicios.
3.  **Levantar el Backend:** Entrar a cada microservicio (`auth` y `perfil`) dentro de la carpeta `backend` y arrancar las aplicaciones Spring Boot usando Maven.
4.  **Levantar el Frontend:** Entrar a la carpeta `frontend`, instalar las dependencias con `npm install` y ejecutar el servidor de desarrollo mediante `npm run dev`.

---

## 6. Documentación Detallada por Áreas

Utilice los siguientes enlaces directos para navegar por el código fuente, la estructura de paquetes y las justificaciones de ingeniería de cada módulo:

### 💻 [Revisar el módulo de FRONTEND (Pantallas y Estado Global) ──►](./frontend/README.md)
*Contiene: Maquetación de vistas, lógica de componentes del cliente y control del rendimiento visual.*

### ⚙️ [Revisar el módulo de BACKEND (Servidores y Persistencia) ──►](./backend/README.md)
*Contiene: Organización interna en capas lógicas en Java (`com.mazanex`), seguridad de credenciales y contratos de Swagger.*
