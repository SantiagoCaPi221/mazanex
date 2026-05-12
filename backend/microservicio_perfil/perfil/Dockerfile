# ETAPA 1: Construcción (Build)
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# 1. Copiamos los archivos de configuración de Maven primero
# Asumiendo que ejecutas el comando desde 'microservicio_perfil'
COPY pom.xml .
COPY perfil/pom.xml ./perfil/

# 2. Descargamos las dependencias (esto se cachea si no cambias los pom)
RUN mvn -f perfil/pom.xml dependency:go-offline

# 3. Copiamos el código fuente y compilamos
COPY perfil/src ./perfil/src
RUN mvn -f perfil/pom.xml clean package -DskipTests

# ETAPA 2: Ejecución (Runtime)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# 4. Copiamos solo el JAR resultante de la etapa anterior
# El nombre del JAR suele seguir el patrón 'perfil-0.0.1-SNAPSHOT.jar'
COPY --from=build /app/perfil/target/*.jar app.jar

# 5. Configuración final
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]