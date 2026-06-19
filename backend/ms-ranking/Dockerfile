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
ENV DEPLOY_ENV=local

# Copiamos el JAR generado
COPY --from=build /app/target/*.jar app.jar

# Inyectamos el puerto 8084 por defecto
ENTRYPOINT java -Dserver.port=${PORT:-8084} -jar app.jar