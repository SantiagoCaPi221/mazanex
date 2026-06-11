#!/usr/bin/env bash
set -euo pipefail

# Simple deploy script for Docker Desktop Kubernetes
# Builds images (local), creates namespace and applies kustomize per service.

NAMESPACE=mazanex

echo "Building images..."
docker build -t mazanex-ms-auth:dev -f backend/ms-auth/Dockerfile backend/ms-auth
docker build -t mazanex-ms-profile:dev -f backend/ms-profile/Dockerfile backend/ms-profile
docker build -t mazanex-ms-publications:dev -f backend/ms-publications/Dockerfile backend/ms-publications
docker build -t mazanex-ms-ranking:dev -f backend/ms-ranking/Dockerfile backend/ms-ranking
docker build -t mazanex-krakend:dev -f backend/bff/Dockerfile backend/bff

echo "Creating namespace (if needed) and applying manifests..."
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

for svc in ms-auth ms-profile ms-publications ms-ranking bff; do
  echo "Applying kustomize for $svc"
  kubectl apply -k backend/${svc}/k8s -n ${NAMESPACE}
done

echo "All done. Use 'kubectl get pods -n ${NAMESPACE}' to see status."

echo "Tip: to forward gateway locally: kubectl port-forward svc/gateway 8080:80 -n ${NAMESPACE}"
