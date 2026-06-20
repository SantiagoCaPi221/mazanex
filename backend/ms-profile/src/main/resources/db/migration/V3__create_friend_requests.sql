CREATE TABLE IF NOT EXISTS friend_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT,
    receiver_id BIGINT,
    status VARCHAR(255),

    CONSTRAINT fk_friend_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_friend_receiver
        FOREIGN KEY (receiver_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);