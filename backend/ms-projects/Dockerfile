# ETAPA 1: Build
# Usamos una imagen específica para asegurar la compatibilidad con Java 17
FROM maven:3.8.5-openjdk-17-slim AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar el caché de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B -Dmaven.wagon.http.ssl.insecure=true -Dmaven.wagon.http.ssl.allowall=true -Dmaven.wagon.http.ssl.ignore.validity.dates=true

# Copiar el código fuente
COPY src ./src

# Limpiar y compilar, saltando tests para evitar fallos de entorno en Docker
RUN mvn clean package -DskipTests

# ETAPA 2: Runtime
# Usamos JRE para que sea más ligero y evitar incluir el compilador JDK en producción
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el jar generado en la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Puerto expuesto
EXPOSE 8085

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]