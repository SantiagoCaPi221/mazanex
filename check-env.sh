#!/bin/bash

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# LISTA REAL DE TUS SERVICIOS (según tu docker-compose.yml)
# Todos usan el servicio llamado 'db'
SERVICES=("auth-service" "profile-service" "publications-service" "ranking-service" "projects-service")

echo "--- 🚀 Iniciando Validación del Entorno Mazanex ---"

# 1. Verificar contenedores activos
if [ $(docker compose ps -q | wc -l) -eq 0 ]; then
    echo -e "${RED}❌ Error: Ningún contenedor está corriendo.${NC}"
    exit 1
fi

# 2. Verificar conectividad MS -> DB (Todos apuntan al servicio 'db')
for MS in "${SERVICES[@]}"; do
    echo "🔍 Verificando $MS -> db (Puerto 3306)..."
    
    CONNECTED=false
    # Usamos un bucle de reintento esperando que el puerto 3306 de 'db' esté abierto
    for i in {1..10}; do
        if docker compose exec -T "$MS" sh -c "nc -z db 3306" > /dev/null 2>&1; then
            CONNECTED=true
            break
        fi
        echo "   ...esperando a que $MS conecte con db ($i/10)..."
        sleep 5
    done

    if [ "$CONNECTED" = true ]; then
        echo -e "${GREEN}✅ Conectividad $MS -> db confirmada.${NC}"
    else
        echo -e "${RED}❌ Error: $MS no pudo conectar a db.${NC}"
        docker compose logs --tail=10 "$MS"
        exit 1
    fi
done

# 3. Verificar BFF (Gateway)
echo "🔍 Verificando Gateway (BFF)..."
sleep 5
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ || echo "000")

if [[ "$HTTP_CODE" =~ ^(200|404|401|403)$ ]]; then
    echo -e "${GREEN}✅ BFF respondiendo (Código: $HTTP_CODE).${NC}"
else
    echo -e "${RED}❌ BFF no responde (Código: $HTTP_CODE).${NC}"
    exit 1
fi

echo -e "\n--- 🎉 Validación completa: Sistema interconectado. ---"
exit 0