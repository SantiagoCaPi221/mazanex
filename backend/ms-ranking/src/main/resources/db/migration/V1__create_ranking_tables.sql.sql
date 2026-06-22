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

-- Tabla para la colección de reportes (@ElementCollection en Score.java)
CREATE TABLE IF NOT EXISTS score_reports (
    score_id BIGINT NOT NULL,
    reporter_id BIGINT NOT NULL,
    FOREIGN KEY (score_id) REFERENCES scores(id) ON DELETE CASCADE
);