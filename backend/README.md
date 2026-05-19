# Backend General - Innovatech

## 1. Descripción 

Backend de Innovatech compuesto por microservicios independientes desarrollados en **Java 17** con **Spring Boot 3.4.5** y **Maven**. Implementa autenticación y gestión de perfiles de usuario con arquitectura limpia y patrones de diseño consolidados.

---

## 2. Arquitectura
```
├── Auth (Puerto 8081)
│   ├── Autenticación y registro de usuarios
│   ├── Validación de credenciales
│   ├── Gestión de roles (USER, CLIENTE, ADMIN)   
│
└── Perfil (Puerto 8082)
    ├── Gestión de perfiles de usuario
    ├── Actualización de datos
    
```

---

## 3. Microservicios

### Auth (Puerto 8081)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/register` | POST | Registrar usuario |
| `/api/auth/login` | POST | Validar credenciales |
| `/api/auth/usuarios` | GET | Listar usuarios |
| `/api/auth/perfil/{id}` | PUT | Actualizar perfil |
| `/api/auth/{id}` | DELETE | Eliminar usuario |

### Perfil (Puerto 8082)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/perfil` | GET | Obtener perfil |
| `/api/perfil` | PUT | Actualizar perfil |
| `/api/perfil/{id}` | GET | Obtener por ID |

---

## 4. Estructura del Proyecto

```
backend/
├── auth/
│   ├── src/main/java/com/mazanex/auth/
│   │   ├── AuthApplication.java
│   │   ├── controller/    (Enrutamiento HTTP)
│   │   ├── service/       (Lógica de negocio)
│   │   ├── repository/    (Acceso a datos)
│   │   └── model/         (Entidades)
│   ├── pom.xml
│   └── dockerfile
│
└── perfil/
    ├── src/main/java/com/mazanex/perfil/
    │   ├── PerfilApplication.java
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   └── model/
    ├── pom.xml
    └── dockerfile
```

---

## 5. Seguridad
- **CORS**: Habilitado para integración con frontend
- No hay generación ni validación de JWT
Las contraseñas se comparan en texto plano, y se valida con una función dentro del código que valida 8 caracteres,  al menos 1 mayuscula, al menos 1 minuscula, almenos 1 número y un simbolo.

 **Recomendaciones para mejorar:**

- Implementar BCryptPasswordEncoder para hashear contraseñas
- Añadir filtro JWT para proteger endpoints sensibles
- Propagar tokens JWT desde el BFF hacia aquí

---
## 6. Patrones y Arquitectura Utilizada
### Repository Pattern
Se implementa mediante `JpaRepository` , lo que permite abstraer el acceso a datos y separar la lógica de negocio de la persistencia.

Este patrón facilita las operaciones CRUD, mejora la testabilidad mediante mocks y permite cambiar la base de datos (por ejemplo, de H2 a MySQL) sin afectar la lógica del sistema.

En el proyecto es utilizado en ambos módulos `(auth y perfil)` a través de `UsuarioRepository`, reduciendo duplicación de código y mejorando el desacoplamiento.

### Strategy Pattern

Permite seleccionar algoritmos o estrategias en tiempo de ejecución, promoviendo el principio de "abierto-cerrado" (Open-Closed Principle). En `PerfilService`, se implementa con la interfaz `ProcesamientoStrategy` y la clase `RegistroSimpleStrategy`, lo que permite extender el procesamiento de perfiles sin modificar el código existente (ej. agregar nuevas estrategias para validaciones complejas).

Se aplica únicamente donde existe variabilidad en la lógica, evitando sobreingeniería y manteniendo el sistema flexible y extensible.

---

## 7. Tecnologías

| Tecnología | Versión |
|------------|---------|
| Java | 17 LTS |
| Spring Boot | 3.4.5 |
| Spring Data JPA | Incluida |
| JWT (JJWT) | 0.9.1 |
| H2 Database | Latest (dev) |
| MySQL Connector | Latest (prod) |
| SpringDoc OpenAPI | 2.1.0 |
| Lombok | Latest |
| Maven | 3.8.1+ |

---

## 8. Ejecutar Localmente

### Requisitos

```bash
java -version    # Java 17 o superior
mvn -version     # Maven 3.8.1 o superior
GitHub Desktop  # Clonacion de repositorio 
```

### Compilar

```bash
git clone https://github.com/makasuim/fullstack-4.git
cd fullstack-4
```

### Ejecutar

**Terminal 1 - Auth (8081)**:
```bash
cd auth
mvn spring-boot:run
```

**Terminal 2 - Perfil (8082)**:
```bash
cd perfil
mvn spring-boot:run
```

### Verificar

```bash
# Auth funcionando
curl http://localhost:8081/api/auth/usuarios

# Perfil funcionando
curl http://localhost:8082/api/perfil

# Swagger Local
# Auth: http://localhost:8081/swagger-ui.html
```

---

## 9. Configuración

### Desarrollo (H2 en memoria)
Configuración automática en memoria.
Los archivos `application.properties` ya están configurados para H2. No requiere cambios.

### 10. Producción (MySQL) Lo unico que cambia entre microservicios en el aplication.properties es el puerto (Auth 8081- Perfil 8082)

```properties
# El puerto es dinámico para Railway, local usa 8082
server.port=${PORT:8082}

# 1. Conexión a MySQL (Variables de Railway con fallback a Local)
spring.datasource.url=jdbc:mysql://${MYSQLHOST:localhost}:${MYSQLPORT:3306}/${MYSQLDATABASE:mazanex_db}?createDatabaseIfNotExist=true&serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=${MYSQLUSER:root}
spring.datasource.password=${MYSQLPASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# 2. JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect

# 3. Límites de carga (Optimizado para Base64)
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
server.tomcat.max-swallow-size=10MB
spring.codec.max-in-memory-size=10MB

# 4. Logs de depuración
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

```
---
### 11. Funcionamiento del sistema 
1. El cliente realiza una solicitud HTTP desde el frontend o un cliente REST (por ejemplo, `POST /auth/register` o `GET /perfil/usuarios`). Esta petición es recibida por el Controller correspondiente (`AuthController o PerfilController`), el cual valida los datos básicos de entrada y delega el procesamiento al servicio de negocio.
   
2. El Service (`AuthService o PerfilService`) contiene la lógica principal del sistema, aplicando reglas de negocio, validaciones y, en el caso del módulo de perfil, utilizando el Strategy Pattern para definir distintos comportamientos de procesamiento.

3. Posteriormente, el Repository (`UsuarioRepository`) se encarga del acceso a datos, interactuando con la base de datos mediante `JpaRepository`, lo que permite operaciones CRUD sin implementación manual de SQL.

4. Finalmente, el Controller retorna una respuesta en formato JSON al cliente, indicando el resultado de la operación (éxito, datos o errores).

---
