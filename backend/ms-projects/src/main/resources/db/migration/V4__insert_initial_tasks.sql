-- Tareas para el proyecto 1 (Innovatech Platform)
INSERT INTO tasks (project_id, title, status, assignee, due_date)
VALUES 
    ((SELECT id FROM projects WHERE name = 'Innovatech Platform'), 'Diseñar API Gateway', 'DONE', 'Santiago Catalan', '2026-06-25'),
    ((SELECT id FROM projects WHERE name = 'Innovatech Platform'), 'Configurar infraestructura AWS', 'DONE', 'Nelson Baeza', '2026-06-22'),
    ((SELECT id FROM projects WHERE name = 'Innovatech Platform'), 'Desarrollar Dashboard Analítico', 'IN_PROGRESS', 'Bruno Stockle', '2026-06-28'),
    ((SELECT id FROM projects WHERE name = 'Innovatech Platform'), 'Implementar Circuit Breaker', 'TODO', 'Vannia', '2026-06-30'),
    ((SELECT id FROM projects WHERE name = 'Innovatech Platform'), 'Pruebas Unitarias (Jacoco)', 'TODO', 'Santiago Catalan', '2026-07-02');

-- Tareas para el proyecto 2 (App Gestión Comercial)
INSERT INTO tasks (project_id, title, status, assignee, due_date)
VALUES 
    ((SELECT id FROM projects WHERE name = 'App Gestión Comercial'), 'Modelado de Base de Datos', 'DONE', 'vannia', '2026-06-15'),
    ((SELECT id FROM projects WHERE name = 'App Gestión Comercial'), 'Crear mocks de interfaz', 'IN_PROGRESS', 'Nelson Baeza', '2026-06-25');