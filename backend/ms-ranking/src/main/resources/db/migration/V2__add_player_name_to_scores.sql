-- Agregamos la columna player_name para desacoplar el microservicio
-- Le ponemos un valor por defecto para que los récords viejos no den error
ALTER TABLE scores ADD COLUMN player_name VARCHAR(255) NOT NULL DEFAULT 'Jugador Oculto';

-- Opcional: Si quieres limpiar la llave foránea antigua que ataba los scores a la tabla users
-- ALTER TABLE scores DROP FOREIGN KEY FK_nombre_de_tu_llave;