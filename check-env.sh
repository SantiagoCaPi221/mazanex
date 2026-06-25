#!/bin/bash

# Colores para mejor legibilidad
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

echo "--- 🚀 Iniciando Validación del Entorno Mazanex ---"

# 1. Verificar si los contenedores están corriendo
CONTAINERS_COUNT=$(docker compose ps -q | wc -l)
if [ "$CONTAINERS_COUNT" -eq 0 ]; then
    echo -e "${RED}❌ Error: No hay contenedores corriendo. Ejecuta 'make up' primero.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Contenedores detectados.${NC}"

# 2. Verificar Healthcheck de la Base de Datos
echo "🔍 Comprobando Base de Datos..."
# Espera hasta 30 segundos si es necesario
DB_STATUS=$(docker inspect --format='{{.State.Health.Status}}' mazanex-db 2>/dev/null)

if [ "$DB_STATUS" != "healthy" ]; then
    echo -e "${RED}❌ DB no está saludable. Estado: $DB_STATUS${NC}"
    echo "Logs de la DB:"
    docker compose logs db --tail=10
    exit 1
fi
echo -e "${GREEN}✅ Base de datos (MySQL) está saludable.${NC}"

# 3. Verificar conectividad de red entre Auth y DB
echo "🔍 Verificando red interna (Auth -> DB)..."
docker compose exec -T auth-service ping -c 1 db > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Red configurada: auth-service puede ver a db.${NC}"
else
    echo -e "${RED}❌ Error de red: auth-service no alcanza a db.${NC}"
    exit 1
fi

# 4. Verificar disponibilidad del Gateway (BFF)
echo "🔍 Verificando Gateway (BFF en puerto 8080)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/)
if [ "$HTTP_CODE" == "000" ] || [ "$HTTP_CODE" == "" ]; then
    echo -e "${RED}❌ El BFF (KrakenD) no responde en el puerto 8080.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ BFF respondiendo correctamente (Código HTTP: $HTTP_CODE).${NC}"
fi

echo -e "\n--- 🎉 Validación completada exitosamente. El sistema está listo. ---"
exit 0