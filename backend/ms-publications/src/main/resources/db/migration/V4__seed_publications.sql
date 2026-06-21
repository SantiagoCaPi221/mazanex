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

-- Anuncio de nuevo trabajo
INSERT INTO publications
(id, author_id, author_name, content, media_url, created_at)
VALUES
(4, 4, 'Valeria Gómez', '¡Feliz de compartir que hoy empiezo un nuevo desafío como Senior Software Engineer! Agradecida por esta oportunidad.', '/nuevo_puesto.png', DATE_SUB(NOW(), INTERVAL 15 MINUTE));

-- Celebración de fin de proyecto / trabajo en equipo
INSERT INTO publications
(id, author_id, author_name, content, media_url, created_at)
VALUES
(5, 5, 'Carlos Mendoza', 'Cerrando el trimestre con los objetivos cumplidos y un equipo de primer nivel. ¡Orgulloso de lo que logramos!', '/selfies_team.jpg', DATE_SUB(NOW(), INTERVAL 45 MINUTE));

-- Post de reclutamiento (Hiring)
INSERT INTO publications
(id, author_id, author_name, content, media_url, created_at)
VALUES
(6, 6, 'Diego Peralta', '¡Estamos contratando! Busco perfiles de QA Automation para sumarse a nuestro squad técnico. Interesados al DM o dejen su CV.', '/busquedajob.jpg', DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- Nueva certificación
INSERT INTO publications
(id, author_id, author_name, content, media_url, created_at)
VALUES
(7, 7, 'Ana María Silva', 'Muy feliz de haber completado la certificación en AWS Certified Solutions Architect. ¡A seguir sumando conocimiento!', '/selfies2.png', DATE_SUB(NOW(), INTERVAL 5 HOUR));