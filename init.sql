-- ==========================================
-- 1. CREACIÓN DE BASES DE DATOS
-- ==========================================
CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS profile_db;
CREATE DATABASE IF NOT EXISTS publications_db;
CREATE DATABASE IF NOT EXISTS ranking_db;

-- ==========================================
-- 2. SEMBRADO DE AUTH (Usuarios)
-- ==========================================
USE auth_db;

-- (Ajusta el nombre de la tabla si tu entidad Java se llama diferente, ej. 'user')
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Inyectamos usuarios de prueba. 
-- La contraseña para todos es: 123456
-- El string largo es el Hash BCrypt exacto que Spring Security espera leer.
INSERT INTO users (id, username, email, password) VALUES 
(1, 'bruno', 'bruno@mazanex.cl', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG'),
(2, 'santiago', 'santiago@mazanex.cl', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG'),
(3, 'nelson', 'nelson@mazanex.cl', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG'),
(4, 'sarai', 'sarai@mazanex.cl', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG');

-- ==========================================
-- 3. SEMBRADO DE PERFILES 
-- ==========================================
USE profile_db;

CREATE TABLE IF NOT EXISTS user_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    bio VARCHAR(255)
);

INSERT INTO user_profile (id, user_id, name, bio) VALUES
(1, 1, 'Bruno Stockle', 'Full-stack dev. Maineando Next.js y Spring Boot.'),
(2, 2, 'Santiago Catalan', 'DevOps Team. Listo para el despliegue.'),
(3, 3, 'Nelson Baeza', 'Optimizando bases de datos y backend.'),
(4, 4, 'Sarai Perez', 'Trabajando en la arquitectura cloud.');

-- ==========================================
-- 4. SEMBRADO DE PUBLICACIONES (El Muro)
-- ==========================================
USE publications_db;

CREATE TABLE IF NOT EXISTS publication (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content VARCHAR(255),
    likes INT DEFAULT 0,
    created_at DATETIME
);

INSERT INTO publication (user_id, content, likes, created_at) VALUES 
(1, '¡Logré levantar toda la arquitectura con KrakenD y Docker! 🚀', 15, NOW()),
(2, '¿A qué hora revisamos los pipelines de CI/CD para la entrega?', 4, NOW()),
(3, 'Subiendo los últimos cambios de los microservicios a GitHub.', 7, NOW()),
(4, 'El reporte de la estrategia Lift & Shift quedó impecable. ¡Buen trabajo equipo!', 12, NOW());