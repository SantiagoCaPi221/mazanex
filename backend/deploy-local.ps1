param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$NAMESPACE = 'mazanex'
Write-Host "Building Docker images..."

docker build -t mazanex-ms-auth:dev -f backend/ms-auth/Dockerfile backend/ms-auth
docker build -t mazanex-ms-profile:dev -f backend/ms-profile/Dockerfile backend/ms-profile
docker build -t mazenex-ms-publications:dev -f backend/ms-publications/Dockerfile backend/ms-publications
docker build -t mazanex-ms-ranking:dev -f backend/ms-ranking/Dockerfile backend/ms-ranking
docker build -t mazanex-krakend:dev -f backend/bff/Dockerfile backend/bff

Write-Host "Creating namespace (if needed) and applying manifests..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

$services = @('mysql','ms-auth','ms-profile','ms-publications','ms-ranking','bff')
foreach ($svc in $services) {
    Write-Host "Applying kustomize for $svc"
    kubectl apply -k "backend/$svc/k8s" -n $NAMESPACE
}

Write-Host "All done. Use 'kubectl get pods -n $NAMESPACE' to see status."
Write-Host "Tip: to forward gateway locally: kubectl port-forward svc/gateway 8080:80 -n $NAMESPACE"