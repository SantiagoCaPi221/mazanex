Manifiestos Kubernetes para MySQL (Mazanex)

Archivos:
- `mysql-secret.yaml`        : Secret con credenciales (MYSQL_ROOT_PASSWORD, MYSQL_USER, ...)
- `mysql-pvc.yaml`           : PersistentVolumeClaim para datos
- `mysql-headless-service.yaml`: Headless Service requerido por el StatefulSet
- `mysql-service.yaml`       : Service ClusterIP para acceso interno (mysql:3306)
- `mysql-statefulset.yaml`   : StatefulSet que despliega MySQL 8.0 y monta PVC
- `kustomization.yaml`      : Agrupa los recursos para `kubectl apply -k .`

Instrucciones rápidas:

1) Ajusta los secretos y la `storageClassName` en `mysql-pvc.yaml` y `mysql-statefulset.yaml` si tu cluster lo requiere.

2) Desplegar todo junto:

```bash
kubectl apply -k backend/mysql/k8s
```

3) Verifica pods y servicios:

```bash
kubectl get pods -n default
kubectl get svc -n default
```

4) Conectar microservicios: en tus deployments de `auth` y `profile` configura `MYSQLHOST=mysql` y `MYSQLPORT=3306` (ya están previstos en los manifests k8s que agregamos anteriormente).

Notas:
- En entornos de producción usa una contraseña segura y habilita backups.
- Para alta disponibilidad considera un clúster o solución gestionada (RDS, Cloud SQL) o un operador de MySQL.
