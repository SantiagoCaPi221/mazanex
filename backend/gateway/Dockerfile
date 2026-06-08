# ETAPA 1: Build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiamos el pom.xml y descargamos dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# El JAR se genera en la carpeta target local del stage anterior
COPY --from=build /app/target/*.jar app.jar

# Inyectamos el puerto 8080 por defecto para el Gateway
ENTRYPOINT java -Dserver.port=${PORT:-8080} -jar app.jarv