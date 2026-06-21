CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    target_user_id BIGINT NOT NULL,

    sender_id BIGINT,

    message VARCHAR(255),

    type VARCHAR(255),

    is_read BOOLEAN DEFAULT FALSE,

    date DATETIME,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (target_user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);