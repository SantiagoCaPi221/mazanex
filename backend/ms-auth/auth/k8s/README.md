# Kubernetes Manifests for Mazanex Auth Microservice

Esta carpeta contiene los manifiestos de Kubernetes para desplegar el microservicio de autenticación.

Archivos incluidos:
- `auth-configmap.yaml`: Configuración de variables de entorno no sensibles.
- `auth-secret.yaml`: Credenciales sensibles de MySQL.
- `auth-deployment.yaml`: Deployment para el contenedor de autenticación.
- `auth-service.yaml`: Servicio ClusterIP para exponer el puerto 8081 internamente.

Notas:
- El servicio de base de datos MySQL debe estar disponible en el cluster con el nombre de servicio `mysql`.
- Se asume que la imagen `mazanex-auth:latest` está disponible localmente o en un registry accesible.
