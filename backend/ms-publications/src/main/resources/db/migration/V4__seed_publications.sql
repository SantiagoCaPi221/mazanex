-- Anuncio de nuevo trabajo (Más reciente, arriba)
INSERT INTO publications (id, author_id, author_name, content, created_at)
VALUES (4, 4, 'Valeria Gómez', '¡Feliz de compartir que hoy empiezo un nuevo desafío como Senior Software Engineer! Agradecida por esta oportunidad.', DATE_SUB(NOW(), INTERVAL 5 MINUTE));

-- Celebración de fin de proyecto (Reciente)
INSERT INTO publications (id, author_id, author_name, content, media_url, created_at)
VALUES (5, 5, 'Carlos Mendoza', 'Cerrando el trimestre con los objetivos cumplidos y un equipo de primer nivel. ¡Orgulloso de lo que logramos!', '/selfies_team.jpg', DATE_SUB(NOW(), INTERVAL 10 MINUTE));

-- Post de reclutamiento (Reciente)
INSERT INTO publications (id, author_id, author_name, content, media_url, created_at)
VALUES (6, 6, 'Diego Peralta', '¡Estamos contratando! Busco perfiles de QA Automation para sumarse a nuestro squad técnico. Interesados al DM o dejen su CV.', '/busquedajob.jpg', DATE_SUB(NOW(), INTERVAL 15 MINUTE));

-- Nueva certificación (Reciente)
INSERT INTO publications (id, author_id, author_name, content, media_url, created_at)
VALUES (7, 7, 'Ana María Silva', 'Muy feliz de haber completado la certificación en AWS Certified Solutions Architect. ¡A seguir sumando conocimiento!', '/selfies2.png', DATE_SUB(NOW(), INTERVAL 20 MINUTE));

-- Memes (Los más antiguos, abajo del todo)
INSERT INTO publications (id, author_id, author_name, content, media_url, created_at)
VALUES (1, 1, 'Bruno Stockle', 'vamoooos!', '/lo_logró.png', DATE_SUB(NOW(), INTERVAL 2 HOUR));

INSERT INTO publications (id, author_id, author_name, content, media_url, created_at)
VALUES (2, 2, 'Santiago Catalan', 'finalmente', '/lo_logre.png', DATE_SUB(NOW(), INTERVAL 2 HOUR) + INTERVAL 1 MINUTE);

INSERT INTO publications (id, author_id, author_name, content, media_url, created_at)
VALUES (3, 3, 'Nelson Baeza', 'terminamos', '/lo_logro.png', DATE_SUB(NOW(), INTERVAL 2 HOUR) + INTERVAL 2 MINUTE);