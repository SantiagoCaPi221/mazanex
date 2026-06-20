CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    publication_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    author_name VARCHAR(255),
    author_avatar_url VARCHAR(255),
    content VARCHAR(255) NOT NULL,
    created_at DATETIME,

    FOREIGN KEY (publication_id)
        REFERENCES publications(id)
        ON DELETE CASCADE
);