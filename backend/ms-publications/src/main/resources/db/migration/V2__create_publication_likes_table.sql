CREATE TABLE publication_likes (
    publication_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    PRIMARY KEY (publication_id, user_id),

    FOREIGN KEY (publication_id)
        REFERENCES publications(id)
        ON DELETE CASCADE
);