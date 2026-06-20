INSERT INTO publications
(id, author_id, author_name, content, media_url, created_at)
VALUES
(1, 1, 'Bruno Stockle', 'vamoooos!', '/lo_logró.png', DATE_SUB(NOW(), INTERVAL 2 MINUTE));

INSERT INTO publications
(id, author_id, author_name, content, media_url, created_at)
VALUES
(2, 2, 'Santiago Catalan', 'finalmente', '/lo_logre.png', DATE_SUB(NOW(), INTERVAL 1 MINUTE));

INSERT INTO publications
(id, author_id, author_name, content, media_url, created_at)
VALUES
(3, 3, 'Nelson Baeza', 'terminamos', '/lo_logro.png', NOW());