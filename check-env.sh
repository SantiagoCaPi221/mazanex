#!/bin/bash
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

SERVICES=("auth-service" "profile-service" "publications-service" "ranking-service" "projects-service")

echo "--- 🚀 Iniciando Validación Dinámica Universal ---"

for MS in "${SERVICES[@]}"; do
    echo "🔍 Validando conectividad: $MS -> db:3306..."

    CONNECTED=false
    for i in {1..10}; do
        # Usamos 'nc' (netcat) que está en casi todos los contenedores
        if docker compose exec -T "$MS" nc -z db 3306 2>/dev/null; then
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
        docker compose logs --tail=20 "$MS"
        exit 1
    fi
done

echo -e "\n--- 🎉 Todo el cluster está funcional. ---"
exit 0