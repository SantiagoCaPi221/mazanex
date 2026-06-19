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

-- ==========================================
-- 4. SEMBRADO DE PUBLICACIONES (El Muro)
-- ==========================================
USE publications_db;

CREATE TABLE IF NOT EXISTS publications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_id BIGINT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_avatar_url LONGTEXT,
    content VARCHAR(2000),
    media_url LONGTEXT,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    publication_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_avatar_url LONGTEXT,
    content VARCHAR(1000) NOT NULL,
    created_at DATETIME
);

CREATE TABLE IF NOT EXISTS publication_likes (
    publication_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (publication_id, user_id)
);

INSERT INTO publications (author_id, author_name, content, created_at) VALUES 
(1, 'Bruno Stockle', '¡Logré levantar toda la arquitectura con KrakenD y Docker! 🚀', NOW()),
(2, 'Santiago Catalan', '¿A qué hora revisamos los pipelines de CI/CD para la entrega?', NOW()),
(3, 'Nelson Baeza', 'Subiendo los últimos cambios de los microservicios a GitHub.', NOW()),
(4, 'Sarai Perez', 'El reporte de la estrategia Lift & Shift quedó impecable. ¡Buen trabajo equipo!', NOW());

INSERT INTO comments (publication_id, author_id, author_name, content, created_at) VALUES
(1, 2, 'Santiago Catalan', '¡Buen trabajo! Ya veo que el gateway está respondiendo bien.', NOW()),
(1, 3, 'Nelson Baeza', 'Perfecto, ahora probemos con más usuarios conectados.', NOW()),
(2, 1, 'Bruno Stockle', 'Sí, revisemos también los tiempos de respuesta de la API.', NOW()),
(4, 3, 'Nelson Baeza', 'Voy a subir el test de carga para validar el ranking.', NOW());

INSERT INTO publication_likes (publication_id, user_id) VALUES
(1, 2),|
(1, 3),
(2, 1),
(2, 4),
(3, 4),
(4, 1);

-- ==========================================
-- 5. SEMBRADO DE RANKING
-- ==========================================
USE ranking_db;

CREATE TABLE IF NOT EXISTS scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    player_name VARCHAR(255) NOT NULL,
    game VARCHAR(255),
    mode VARCHAR(255),
    high_score INT,
    screenshot_url LONGTEXT,
    verified BOOLEAN DEFAULT FALSE,
    upload_date DATETIME
);

CREATE TABLE IF NOT EXISTS score_reports (
    score_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    PRIMARY KEY (score_id, reporter_id)
);

INSERT INTO scores (user_id, player_name, game, mode, high_score, screenshot_url, verified, upload_date) VALUES
(1, 'Bruno Stockle', 'Snake', 'Classic', 9800, 'https://mazanex.local/screenshots/snake-classic-9800.png', TRUE, NOW()),
(2, 'Santiago Catalan', 'Snake', 'Challenge', 8700, 'https://mazanex.local/screenshots/snake-challenge-8700.png', FALSE, NOW());

INSERT INTO score_reports (score_id, reporter_id) VALUES
(1, 2),
(1, 3),
(2, 1);