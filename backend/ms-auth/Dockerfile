# ETAPA 1: Construcción (Maven)
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copiamos solo el pom.xml para aprovechar la caché de capas de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests

# ETAPA 2: Ejecución (Runtime ligero)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Creamos un usuario no-root por seguridad
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Copiamos solo el JAR desde la etapa de construcción
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto (informativo para K8s/Docker)
EXPOSE 8081

# Usamos ENTRYPOINT directo. 
# Spring Boot leerá la variable SERVER_PORT si la inyectamos 
# desde K8s o Docker, o usará 8081 por defecto.
ENTRYPOINT ["java", "-jar", "app.jar"]