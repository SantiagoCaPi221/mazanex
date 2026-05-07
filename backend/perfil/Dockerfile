FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# 1. Copiamos los archivos críticos
COPY pom.xml .
COPY perfil/ ./perfil/

# 2. Debug (Para ver en los logs si todo está en su sitio)
RUN ls -la && ls -la perfil/

# 3. Build del módulo perfil
RUN mvn -f perfil/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/perfil/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
