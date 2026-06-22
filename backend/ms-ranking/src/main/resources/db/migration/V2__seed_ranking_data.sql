-- V2__seed_ranking_data.sql
-- Limpiamos datos previos para evitar duplicados en cada despliegue
DELETE FROM score_reports;
DELETE FROM scores;

-- Insertamos puntuaciones reales, diversificadas por modo y puntaje
INSERT INTO scores (user_id, player_name, game, mode, high_score, verified, upload_date)
VALUES 
-- MODO: MAX - ELITE - PORTAL OFF (El más difícil)
(1, 'Bruno Stockle', 'Snake', 'MAX - ELITE - PORTAL OFF', 52, true, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 'Santiago Catalan', 'Snake', 'MAX - ELITE - PORTAL OFF', 48, true, DATE_SUB(NOW(), INTERVAL 2 HOUR)),

-- MODO: PRO - ELITE - PORTAL ON
(3, 'Nelson Baeza', 'Snake', 'PRO - ELITE - PORTAL ON', 31, true, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(4, 'Vannia', 'Snake', 'PRO - ELITE - PORTAL ON', 29, true, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(5, 'Kevin Random', 'Snake', 'PRO - ELITE - PORTAL ON', 24, true, DATE_SUB(NOW(), INTERVAL 5 HOUR)),

-- MODO: CASUAL
(6, 'Camila QA', 'Snake', 'MINI - SLOW - PORTAL ON', 80, true, DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(7, 'Matias Dev', 'Snake', 'MINI - SLOW - PORTAL ON', 65, true, DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(8, 'Valentina UI', 'Snake', 'MINI - SLOW - PORTAL ON', 40, true, DATE_SUB(NOW(), INTERVAL 8 HOUR));