-- Comentarios para Publicación 1, 2, 3 (Memes)
INSERT INTO comments (publication_id, author_id, author_name, author_avatar_url, content, created_at)
VALUES 
(1, 5, 'Kevin', '/avatar_kevin.png', 'JAJAJA literal nosotros sufriendo con Kubernetes.', NOW()),
(1, 6, 'Camila QA', '/avatar_camila.png', 'Al fin, ya era hora de que levantara todo.', NOW()),
(2, 7, 'Matias Dev', '/avatar_mati.png', 'Dudoso, pero sí, pasó las pruebas.', NOW()),
(3, 8, 'Valentina UI', '/avatar_val.png', 'Épico. Guarden captura de esto para el informe.', NOW()),
(3, 4, 'vannia', '/avatar_vannia.png', '¡Buen trabajo equipo, quedó impecable!', NOW());

-- Comentarios para Publicación 4 (Valeria)
INSERT INTO comments (publication_id, author_id, author_name, author_avatar_url, content, created_at)
VALUES 
(4, 9, 'Andrés PM', '/avatar_andres.png', '¡Muchos éxitos en esta nueva etapa, Vale! Te lo mereces un montón.', NOW()),
(4, 10, 'Loreto Tech Lead', '/avatar_loreto.png', '¡Qué gran incorporación para el equipo! Bienvenida a bordo.', NOW());

-- Comentarios para Publicación 5 (Carlos)
INSERT INTO comments (publication_id, author_id, author_name, author_avatar_url, content, created_at)
VALUES 
(5, 11, 'Nicolás Frontend', '/avatar_nico.png', '¡Tremendo equipo! Un orgullo haber sido parte de este sprint.', NOW()),
(5, 12, 'Beatriz Scrum', '/avatar_bea.png', 'Objetivos cumplidos y con creces. ¡Excelente cierre de Q!', NOW());

-- Comentarios para Publicación 6 (Diego)
INSERT INTO comments (publication_id, author_id, author_name, author_avatar_url, content, created_at)
VALUES 
(6, 13, 'Cristian Dev', '/avatar_cristian.png', '¡Gran oportunidad! Comento y comparto para dar visibilidad.', NOW()),
(6, 14, 'Ignacio QA', '/avatar_ignacio.png', 'Te hablé al DM, Diego. ¡Me interesa mucho la propuesta!', NOW());

-- Comentarios para Publicación 7 (Ana María)
INSERT INTO comments (publication_id, author_id, author_name, author_avatar_url, content, created_at)
VALUES 
(7, 15, 'Felipe Cloud', '/avatar_felipe.png', '¡Buenísima, Ana! Esa certificación es bien pesada. ¡Felicitaciones!', NOW()),
(7, 16, 'Esteban DevOps', '/avatar_esteban.png', '¡A romperla! El siguiente paso es la Professional, ¡éxito!', NOW());