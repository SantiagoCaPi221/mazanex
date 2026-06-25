#!/bin/bash
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Formato: "SERVICIO:NOMBRE_BD"
SERVICES=("auth-service:auth_db" "profile-service:profile_db" "publications-service:publications_db" "ranking-service:ranking_db" "projects-service:db_projects")

echo "--- 🚀 Iniciando Validación Dinámica Mazanex ---"

# 1. Verificar conectividad MS -> db
for ITEM in "${SERVICES[@]}"; do
    MS="${ITEM%%:*}"
    echo "🔍 Validando conectividad: $MS -> db (host)..."
    
    # Intentar conectar al host 'db' en puerto 3306 hasta 10 veces
    CONNECTED=false
    for i in {1..10}; do
        if docker compose exec -T "$MS" bash -c "</dev/tcp/db/3306" 2>/dev/null; then
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

echo -e "\n--- 🎉 Todo el cluster de Mazanex está funcional. ---"
exit 0