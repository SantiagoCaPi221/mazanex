INSERT INTO tasks (project_id, title, status)
VALUES (
    (SELECT id FROM projects WHERE name = 'Innovatech Platform'),
    'Diseñar API Gateway',
    'TODO'
);