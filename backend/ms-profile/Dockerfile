# ETAPA 1: Build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Al estar el Root Directory en 'perfil', el pom.xml está en la raíz del contexto
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos la carpeta src (relativa a la carpeta perfil/)
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Runtime
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
ENV DEPLOY_ENV=local

# El JAR se genera en la carpeta target local del stage anterior
COPY --from=build /app/target/*.jar app.jar

# Railway inyecta la variable $PORT. Usamos formato shell para que se expanda.
ENTRYPOINT java -Dserver.port=${PORT:-8082} -jar app.jar
