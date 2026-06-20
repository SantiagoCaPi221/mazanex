CREATE TABLE publications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    author_id BIGINT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_avatar_url VARCHAR(255),
    content VARCHAR(2000),
    media_url LONGTEXT,
    created_at DATETIME
);