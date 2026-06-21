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

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (id, name, email, password) VALUES 
(1, 'bruno', 'bruno@mazanex.cl', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG'),
(2, 'santiago', 'santiago@mazanex.cl', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG'),
(3, 'nelson', 'nelson@mazanex.cl', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG'),
(4, 'sarai', 'sarai@mazanex.cl', '$2a$10$xn3LI/AjqicFYZFruSwve.681477XaVNaUQbr1gioaWPn4t1KsnmG');

-- ==========================================
-- 3. SEMBRADO DE PERFILES (CORREGIDO)
-- ==========================================
USE profile_db;

-- 🚨 CORRECCIÓN: Le quitamos el AUTO_INCREMENT al id
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY, 
    name VARCHAR(255),
    email VARCHAR(255),
    avatar_url LONGTEXT,
    banner_url LONGTEXT,
    bio VARCHAR(255),
    background_url LONGTEXT
);

INSERT INTO users (id, name, email, bio) VALUES
(1, 'Bruno Stockle', 'bruno@mazanex.cl', 'Full-stack dev. Maineando Next.js y Spring Boot.'),
(2, 'Santiago Catalan', 'santiago@mazanex.cl', 'DevOps Team. Listo para el despliegue.'),
(3, 'Nelson Baeza', 'nelson@mazanex.cl', 'Optimizando bases de datos y backend.'),
(4, 'Sarai Perez', 'sarai@mazanex.cl', 'Trabajando en la arquitectura cloud.');

