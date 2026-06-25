# Makefile para el proyecto Mazanex

.PHONY: help up down logs check restart

# Por defecto, muestra la ayuda
help:
	@echo "Comandos disponibles:"
	@echo "  make up      - Levanta todos los servicios (docker-compose up)"
	@echo "  make down    - Detiene y elimina los contenedores (docker-compose down)"
	@echo "  make logs    - Muestra los logs en tiempo real (seguimiento)"
	@echo "  make check   - Ejecuta el script de validación (check-env.sh)"
	@echo "  make restart - Reinicia todo el entorno"

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f --tail=100

check:
	@echo "Ejecutando script de validación..."
	@chmod +x check-env.sh
	@./check-env.sh

restart:
	docker compose down
	docker compose up -d