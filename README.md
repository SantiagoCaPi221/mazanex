# 🚀 Innovatech - Plataforma de Inicio de Sesión y Perfiles de Usuario

---

## 📝 1. ¿De qué se trata el proyecto?

**Innovatech** es una plataforma web diseñada para resolver de forma segura y rápida el acceso de los usuarios en entornos empresariales. Para cumplir con el alcance solicitado por el profesor, el sistema se enfoca al 100% en tres funciones clave: **el Inicio de Sesión (Login), el Registro de nuevas cuentas y la Edición de Perfiles**.

### 🎯 Objetivos principales:
* **Seguridad:** Cuidar las contraseñas de los usuarios para que nadie pueda robarlas.
* **Rapidez:** Hacer que la página responda al instante cuando el usuario cambia sus datos o su foto de perfil.
* **Independencia:** Si el servidor de perfiles llega a fallar, la pantalla de inicio de sesión puede seguir funcionando sin caerse todo el sistema.

---

## 🏗️ 2. ¿Cómo funciona el sistema? (Estructura general)

El proyecto está dividido en partes independientes que se comunican entre sí de forma ordenada:

1. **El Frontend (La Pantalla):** Lo que ve el usuario en su navegador, diseñado para reaccionar rápido a los cambios.
2. **El API Gateway (El Intermediario):** Un escudo de seguridad que recibe todas las peticiones del navegador y las reparte hacia los servidores correspondientes.
3. **El Backend (Los Servidores):** Dos servicios ocultos en la nube de Railway (`auth` para la seguridad y `perfil` para los datos).
4. **La Base de Datos:** Dos espacios separados en MySQL para guardar la información sin que se mezclen las responsabilidades.

---

## 🛠️ 3. Requisitos para probarlo en el PC

Para hacer funcionar la plataforma completa de forma local, necesitas tener instalado:

* **Java JDK 21** (Para correr los servidores backend).
* **Node.js** (Para levantar la página web frontend).
* **MySQL** (Para conectar las bases de datos).

---

## 🧭 4. Documentación por Áreas

Haz clic en los siguientes enlaces para revisar el detalle de cada parte del proyecto durante la presentación:
### 💻 [Revisar el FRONTEND (Pantallas y Estado Global) ──►](./frontend/README.md)
### ⚙️ [Revisar el BACKEND (Servidores, Java y MySQL) ──►](./backend/README.md)
