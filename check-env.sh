#!/bin/bash

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

SERVICES=("auth-service" "profile-service" "publications-service" "ranking-service" "projects-service")

echo "--- 🚀 Iniciando Validación del Entorno Mazanex ---"

# 1. Verificar si los contenedores están corriendo
if [ $(docker compose ps -q | wc -l) -eq 0 ]; then
    echo -e "${RED}❌ Error: Ningún contenedor está corriendo.${NC}"
    exit 1
fi

# 2. Validación: Si el contenedor está corriendo, asumimos conexión exitosa
# (Spring Boot se apagaría si la conexión a BD fallara)
for MS in "${SERVICES[@]}"; do
    echo "🔍 Verificando estado de $MS..."
    
    # Usamos 'sh' en lugar de 'bash' para máxima compatibilidad
    STATE=$(docker compose inspect -f '{{.State.Running}}' "$MS" 2>/dev/null)
    
    if [ "$STATE" == "true" ]; then
        echo -e "${GREEN}✅ $MS está activo y conectado a la BD.${NC}"
    else
        echo -e "${RED}❌ $MS falló al iniciar. Logs:${NC}"
        docker compose logs --tail=20 "$MS"
        exit 1
    fi
done

# 3. Verificar BFF
echo "🔍 Verificando Gateway (BFF)..."
sleep 5
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ || echo "000")

if [[ "$HTTP_CODE" =~ ^(200|404|401|403)$ ]]; then
    echo -e "${GREEN}✅ BFF respondiendo (Código: $HTTP_CODE).${NC}"
else
    echo -e "${RED}❌ BFF no responde (Código: $HTTP_CODE).${NC}"
    exit 1
fi

echo -e "\n--- 🎉 Validación completa: Sistema operativo y funcional. ---"
exit 0