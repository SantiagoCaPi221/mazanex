CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    avatar_url LONGTEXT,
    banner_url LONGTEXT,
    bio VARCHAR(255),
    background_url LONGTEXT
);