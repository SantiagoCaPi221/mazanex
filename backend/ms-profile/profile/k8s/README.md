# Kubernetes Manifests for Mazanex Profile Microservice

Esta carpeta contiene los manifiestos de Kubernetes para desplegar el microservicio de perfil.

Archivos incluidos:
- `profile-configmap.yaml`: Configuración de variables de entorno no sensibles.
- `profile-secret.yaml`: Credenciales sensibles de MySQL.
- `profile-deployment.yaml`: Deployment para el contenedor de perfil.
- `profile-service.yaml`: Servicio ClusterIP para exponer el puerto 8082 internamente.

Notas:
- El servicio de base de datos MySQL debe estar disponible en el cluster con el nombre de servicio `mysql`.
- Se asume que la imagen `mazanex-profile:latest` está disponible localmente o en un registry accesible.
