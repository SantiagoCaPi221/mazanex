CREATE TABLE IF NOT EXISTS followers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    followed_id BIGINT NOT NULL,
    follower_id BIGINT NOT NULL,
    created_at DATETIME,

    CONSTRAINT fk_followers_followed
        FOREIGN KEY (followed_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_followers_follower
        FOREIGN KEY (follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);