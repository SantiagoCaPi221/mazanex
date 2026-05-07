FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# 1. Copiamos los archivos críticos uno por uno para asegurar que entren
COPY pom.xml .
COPY auth/ ./auth/

# 2. Listamos archivos para ver si de verdad se copiaron (esto saldrá en el log)
RUN ls -la && ls -la auth/

# 3. Intentamos el build
RUN mvn -f auth/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/auth/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
