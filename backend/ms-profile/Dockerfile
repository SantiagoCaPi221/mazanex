# ETAPA 1: Build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiamos primero solo el pom.xml para aprovechar la caché de capas de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos solo el jar ejecutable (evitando archivos temporales de maven)
# El asterisco busca el archivo .jar generado en target
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto y ejecutamos
EXPOSE 8082
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8082} -jar app.jar"]