-- Limpieza de la tabla
DELETE FROM publication_likes;

-- Likes para los Memes (Publicaciones 1, 2, 3)
INSERT INTO publication_likes (publication_id, user_id) VALUES
(1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(2, 4), (2, 7), (2, 8),
(3, 1), (3, 2), (3, 4), (3, 5);

-- Likes para Valeria Gómez (Publicación 4 - Nuevo trabajo)
INSERT INTO publication_likes (publication_id, user_id) VALUES
(4, 1), (4, 2), (4, 3), (4, 5), (4, 6);

-- Likes para Carlos Mendoza (Publicación 5 - Equipo)
INSERT INTO publication_likes (publication_id, user_id) VALUES
(5, 6), (5, 7), (5, 8), (5, 1);

-- Likes para Diego Peralta (Publicación 6 - Hiring)
INSERT INTO publication_likes (publication_id, user_id) VALUES
(6, 1), (6, 8), (6, 3), (6, 4);

-- Likes para Ana María Silva (Publicación 7 - AWS)
INSERT INTO publication_likes (publication_id, user_id) VALUES
(7, 2), (7, 3), (7, 5), (7, 6), (7, 4);