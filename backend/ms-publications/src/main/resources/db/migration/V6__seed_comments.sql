INSERT INTO comments
(publication_id, author_id, author_name, content, created_at)
VALUES
(1, 5, 'Kevin', 'JAJAJA literal nosotros sufriendo con Kubernetes.', NOW()),
(1, 6, 'Camila QA', 'Al fin, ya era hora de que levantara todo.', NOW()),
(2, 7, 'Matias Dev', 'Dudoso, pero sí, pasó las pruebas.', NOW()),
(3, 8, 'Valentina UI', 'Épico. Guarden captura de esto para el informe.', NOW()),
(3, 4, 'vannia', '¡Buen trabajo equipo, quedó impecable!', NOW());

-- Comentarios para Publicación 4 (Nuevo trabajo de Valeria)
INSERT INTO comments
(publication_id, author_id, author_name, content, created_at)
VALUES
(4, 9, 'Andrés PM', '¡Muchos éxitos en esta nueva etapa, Vale! Te lo mereces un montón.', NOW()),
(4, 10, 'Loreto Tech Lead', '¡Qué gran incorporación para el equipo! Bienvenida a bordo.', NOW());

-- Comentarios para Publicación 5 (Cierre de proyecto de Carlos)
INSERT INTO comments
(publication_id, author_id, author_name, content, created_at)
VALUES
(5, 11, 'Nicolás Frontend', '¡Tremendo equipo! Un orgullo haber sido parte de este sprint.', NOW()),
(5, 12, 'Beatriz Scrum', 'Objetivos cumplidos y con creces. ¡Excelente cierre de Q!', NOW());

-- Comentarios para Publicación 6 (Búsqueda laboral de Diego)
INSERT INTO comments
(publication_id, author_id, author_name, content, created_at)
VALUES
(6, 13, 'Cristian Dev', '¡Gran oportunidad! Comento y comparto para dar visibilidad.', NOW()),
(6, 14, 'Ignacio QA', 'Te hablé al DM, Diego. ¡Me interesa mucho la propuesta!', NOW());

-- Comentarios para Publicación 7 (Certificación AWS de Ana María)
INSERT INTO comments
(publication_id, author_id, author_name, content, created_at)
VALUES
(7, 15, 'Felipe Cloud', '¡Buenísima, Ana! Esa certificación es bien pesada. ¡Felicitaciones!', NOW()),
(7, 16, 'Esteban DevOps', '¡A romperla! El siguiente paso es la Professional, ¡éxito!', NOW());