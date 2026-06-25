#!/bin/bash

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Configuración: "microservicio:host_base_datos"
# Asegúrate de que los nombres coincidan exactamente con tu docker-compose.yml
SERVICES=(
    "ms-auth:auth-db"
    "ms-profile:profile-db"
    "ms-projects:projects-db"
    "ms-publications:publications-db"
    "ms-ranking:ranking-db"
)

echo "--- 🚀 Iniciando Validación del Entorno Mazanex ---"

# 1. Verificar contenedores activos
if [ $(docker compose ps -q | wc -l) -eq 0 ]; then
    echo -e "${RED}❌ Error: Ningún contenedor está corriendo.${NC}"
    exit 1
fi

# 2. Verificar conectividad MS -> DB (Bucle dinámico)
for ITEM in "${SERVICES[@]}"; do
    MS="${ITEM%%:*}"
    DB="${ITEM#*:}"

    echo "🔍 Verificando $MS -> $DB (Puerto 3306)..."
    
    CONNECTED=false
    for i in {1..10}; do
        # Intentamos conectar usando nc
        if docker compose exec -T "$MS" nc -z "$DB" 3306 > /dev/null 2>&1; then
            CONNECTED=true
            break
        fi
        echo "   ...esperando a $DB ($i/10)..."
        sleep 5
    done

    if [ "$CONNECTED" = true ]; then
        echo -e "${GREEN}✅ Conectividad $MS -> $DB confirmada.${NC}"
    else
        echo -e "${RED}❌ Error: $MS no pudo conectar a $DB tras varios intentos.${NC}"
        exit 1
    fi
done

# 3. Verificar BFF (Gateway)
echo "🔍 Verificando Gateway (BFF)..."
# Damos unos segundos extra para que KrakenD termine de cargar sus rutas
sleep 5
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ || echo "000")

if [[ "$HTTP_CODE" =~ ^(200|404)$ ]]; then
    echo -e "${GREEN}✅ BFF respondiendo correctamente (Código: $HTTP_CODE).${NC}"
else
    echo -e "${RED}❌ BFF no responde o dio error (Código: $HTTP_CODE).${NC}"
    exit 1
fi

echo -e "\n--- 🎉 Validación completa: Todo el sistema está interconectado. ---"
exit 0