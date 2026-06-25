#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "--- 🚀 Iniciando Validación del Entorno Mazanex ---"

# 1. Verificar contenedores
if [ $(docker compose ps -q | wc -l) -eq 0 ]; then
    echo -e "${RED}❌ Error: No hay contenedores corriendo.${NC}"
    exit 1
fi

# 2. Verificar DB (Healthcheck)
echo "🔍 Comprobando Base de Datos..."
DB_STATUS=$(docker inspect --format='{{.State.Health.Status}}' mazanex-db 2>/dev/null)
if [ "$DB_STATUS" != "healthy" ]; then
    echo -e "${RED}❌ DB no saludable. Estado: $DB_STATUS${NC}"
    exit 1
fi
echo -e "${GREEN}✅ DB Saludable.${NC}"

# 3. Verificación robusta: Esperar conexión a puerto (sin depender de 'ping')
echo "🔍 Verificando conexión Auth -> DB (Puerto 3306)..."
# Intentamos conectar hasta 10 veces antes de fallar
RETRIES=10
CONNECTED=false
for i in $(seq 1 $RETRIES); do
    if docker compose exec -T auth-service sh -c "nc -z db 3306" > /dev/null 2>&1; then
        CONNECTED=true
        break
    fi
    echo "   ...esperando a DB ($i/$RETRIES)..."
    sleep 3
done

if [ "$CONNECTED" = true ]; then
    echo -e "${GREEN}✅ Conectividad Auth -> DB confirmada.${NC}"
else
    echo -e "${RED}❌ Error: Tiempo de espera agotado, no hay conexión a DB.${NC}"
    exit 1
fi

# 4. Verificar BFF
echo "🔍 Verificando Gateway (BFF)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ || echo "000")
if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✅ BFF respondiendo correctamente.${NC}"
else
    echo -e "${RED}❌ BFF no responde (Código: $HTTP_CODE).${NC}"
    exit 1
fi

echo -e "\n--- 🎉 Validación exitosa! ---"