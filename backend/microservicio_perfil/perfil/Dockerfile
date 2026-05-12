# ETAPA 1: Build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Al estar en el Root Directory, copiamos directamente el pom.xml
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Railway inyecta una variable de entorno $PORT, Spring debe escucharla
# Copiamos el JAR
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto (Railway suele usar el 8080 por defecto si no se especifica)
EXPOSE 8082

# IMPORTANTE: Pasamos el puerto de Railway a Spring Boot
ENTRYPOINT ["java", "-Dserver.port=${PORT:8082}", "-jar", "app.jar"]