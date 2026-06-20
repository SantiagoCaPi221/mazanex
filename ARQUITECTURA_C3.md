# Diagrama C3 - Arquitectura Mazanex (FINAL)

## Diagrama Completo - Todas las Capas

```mermaid
graph TB
    User["👤 Usuario"]
    Browser["🌐 Frontend Next.js<br/>Port 3000"]
    
    User -->|Interactúa| Browser
    Browser -->|HTTP/REST<br/>Port 8080| KrakenD["🔗 KrakenD<br/>API Gateway"]
    
    %% AUTH SERVICE
    KrakenD -->|/api/auth/*| AuthCtrl["🎯 AuthController<br/>POST /register<br/>POST /login<br/>PUT /password"]
    AuthCtrl -->|Business Logic| AuthSvc["⚙️ AuthService<br/>authenticate()<br/>generateJWT()<br/>syncWithProfile()"]
    AuthSvc -->|JPA| AuthRepo["📦 UserRepository<br/>findByEmail()<br/>save()"]
    AuthRepo -->|CRUD| AuthDB[("💾 MySQL<br/>auth_db")]
    
    %% PROFILE SERVICE
    KrakenD -->|/api/profile/*| ProfileCtrl["🎯 ProfileController<br/>GET /list<br/>PUT /{id}<br/>DELETE /{id}"]
    ProfileCtrl -->|Business Logic| ProfileSvc["⚙️ ProfileService<br/>getProfile()<br/>updateProfile()<br/>syncWithAuth()"]
    ProfileSvc -->|JPA| ProfileRepo["📦 ProfileRepository<br/>findByUserId()<br/>update()"]
    ProfileRepo -->|CRUD| ProfileDB[("💾 MySQL<br/>profile_db")]
    
    %% PUBLICATIONS SERVICE
    KrakenD -->|/api/publications/*| PubCtrl["🎯 PublicationController<br/>GET /feed<br/>POST /<br/>POST /{id}/like"]
    PubCtrl -->|Business Logic| PubSvc["⚙️ PublicationService<br/>createPublication()<br/>addComment()<br/>toggleLike()"]
    PubSvc -->|JPA| PubRepo["📦 PublicationRepository<br/>findById()<br/>save()"]
    PubRepo -->|CRUD| PubDB[("💾 MySQL<br/>publications_db")]
    
    %% RANKING SERVICE
    KrakenD -->|/api/ranking/*| RankCtrl["🎯 RankingController<br/>GET /user/{id}<br/>POST /save-record<br/>GET /{game}"]
    RankCtrl -->|Business Logic| RankSvc["⚙️ RankingService<br/>submitScore()<br/>getLeaderboard()<br/>getPosition()"]
    RankSvc -->|JPA| RankRepo["📦 ScoreRepository<br/>findByGameId()<br/>save()"]
    RankRepo -->|CRUD| RankDB[("💾 MySQL<br/>ranking_db")]
    
    %% INTER-SERVICE COMMUNICATION
    AuthSvc -->|POST /api/profile/sync<br/>RestTemplate + CircuitBreaker| ProfileSvc
    ProfileSvc -.->|Response| AuthSvc
    
    %% JWT VALIDATION
    AuthSvc -->|JwtService| JwtAuth["🔐 JWT<br/>Token Generation"]
    ProfileSvc -->|JwtAuthenticationFilter| JwtProfile["🔐 JWT<br/>Validation"]
    PubSvc -->|JwtAuthenticationFilter| JwtPub["🔐 JWT<br/>Validation"]
    RankSvc -->|JwtAuthenticationFilter| JwtRank["🔐 JWT<br/>Validation"]
    
    %% STYLING
    style User fill:#7CB342,stroke:#558B2F,stroke-width:2px,color:#fff
    style Browser fill:#FB8C00,stroke:#E65100,stroke-width:2px,color:#fff
    style KrakenD fill:#42A5F5,stroke:#1565C0,stroke-width:3px,color:#fff
    
    style AuthCtrl fill:#A1887F,stroke:#5D4037,stroke-width:2px,color:#fff
    style AuthSvc fill:#81C784,stroke:#388E3C,stroke-width:2px,color:#fff
    style AuthRepo fill:#C8E6C9,stroke:#558B2F,stroke-width:2px,color:#000
    style AuthDB fill:#FFE082,stroke:#F57F17,stroke-width:2px,color:#000
    
    style ProfileCtrl fill:#A1887F,stroke:#5D4037,stroke-width:2px,color:#fff
    style ProfileSvc fill:#64B5F6,stroke:#01579B,stroke-width:2px,color:#fff
    style ProfileRepo fill:#BBDEFB,stroke:#0277BD,stroke-width:2px,color:#000
    style ProfileDB fill:#FFE082,stroke:#F57F17,stroke-width:2px,color:#000
    
    style PubCtrl fill:#A1887F,stroke:#5D4037,stroke-width:2px,color:#fff
    style PubSvc fill:#BA68C8,stroke:#6A1B9A,stroke-width:2px,color:#fff
    style PubRepo fill:#E1BEE7,stroke:#8E24AA,stroke-width:2px,color:#000
    style PubDB fill:#FFE082,stroke:#F57F17,stroke-width:2px,color:#000
    
    style RankCtrl fill:#A1887F,stroke:#5D4037,stroke-width:2px,color:#fff
    style RankSvc fill:#FF8A65,stroke:#D84315,stroke-width:2px,color:#fff
    style RankRepo fill:#FFCCBC,stroke:#E65100,stroke-width:2px,color:#000
    style RankDB fill:#FFE082,stroke:#F57F17,stroke-width:2px,color:#000
    
    style JwtAuth fill:#81C784,stroke:#2E7D32,stroke-width:2px,color:#fff
    style JwtProfile fill:#64B5F6,stroke:#0277BD,stroke-width:2px,color:#fff
    style JwtPub fill:#BA68C8,stroke:#512DA8,stroke-width:2px,color:#fff
    style JwtRank fill:#FF8A65,stroke:#BF360C,stroke-width:2px,color:#fff
```

---

## 📐 Capas en Cada Microservicio

Cada microservicio tiene 4 capas:

```
┌─────────────────────────────────────────┐
│  🎯 LAYER 1: CONTROLLER                 │
│  Recibe HTTP requests del Gateway       │
│  Mapea rutas, valida DTOs              │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│  ⚙️ LAYER 2: SERVICE                    │
│  Lógica de negocio                      │
│  Gestión de transacciones               │
│  Comunicación inter-servicio            │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│  📦 LAYER 3: REPOSITORY                 │
│  Acceso a datos via JPA                 │
│  Queries a la BD                        │
└────────────────────┬────────────────────┘
                     │
┌────────────────────▼────────────────────┐
│  💾 LAYER 4: DATABASE                   │
│  MySQL con su schema independiente      │
│  Almacenamiento persistente             │
└─────────────────────────────────────────┘
```

---

## 📋 Resumen de Conexiones

### Conexiones por Microservicio

| Servicio | Puerto | Gateway | Conexiones Externas |
|----------|--------|---------|-------------------|
| **Auth Service** | 8081 | `/api/auth/*` | → Profile Service (sync) |
| **Profile Service** | 8082 | `/api/profile/*` | ← Auth Service (sync) |
| **Publications Service** | 8083 | `/api/publications/*` | Independiente |
| **Ranking Service** | 8084 | `/api/ranking/*` | Independiente |

### Endpoints Principales

#### Auth Service
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/users`
- `PUT /api/auth/{id}/password`
- `PUT /api/auth/profile/{id}`
- `DELETE /api/auth/{id}`

#### Profile Service
- `GET /api/profile/list`
- `POST /api/profile/sync` (recibe de Auth)
- `PUT /api/profile/{id}`
- `DELETE /api/profile/{id}`
- `GET /api/profile/social/*` (social features)

#### Publications Service
- `GET /api/publications/feed`
- `GET /api/publications/user/{userId}`
- `POST /api/publications`
- `POST /api/publications/{id}/like`
- `POST /api/publications/{id}/comment`
- `DELETE /api/publications/{id}`

#### Ranking Service
- `GET /api/ranking/user/{userId}`
- `GET /api/ranking/{game}`
- `POST /api/ranking/save-record`
- `POST /api/ranking/report/{id}`

---

## 🔌 Flujos de Datos Principales

### 1. Registro de Usuario
```
Frontend → KrakenD → Auth Service
                    ↓
            Guarda en auth_db
                    ↓
            Llama a ProfileService (/api/profile/sync)
                    ↓
            Profile Service guarda en profile_db
```

### 2. Login
```
Frontend → KrakenD → Auth Service
                    ↓
            Valida credenciales en auth_db
                    ↓
            Genera JWT Token
                    ↓
            Retorna token al Frontend
```

### 3. Consumir un Servicio Protegido
```
Frontend (con JWT en header)
    ↓
KrakenD
    ↓
Microservicio (cualquiera)
    ↓
JwtAuthenticationFilter valida localmente
    ↓
Controller procesa el request
    ↓
Service + Repository acceden a su DB
    ↓
Retorna respuesta al Frontend
```

---

## 🔐 Seguridad

- **JWT**: Generado por Auth Service, validado localmente en cada microservicio
- **Validación Local**: Cada servicio tiene su propio `JwtService` + `JwtAuthenticationFilter`
- **Sin comunicación remota para JWT**: No hay llamadas entre servicios para validar tokens
- **Circuit Breaker**: Protege la sincronización Auth ↔ Profile

---

## 📊 Capas Internas (igual en todos los servicios)

```
HTTP Layer
    ↓
@Controller (recibe requests)
    ↓
@Service (lógica de negocio)
    ↓
@Repository (acceso a datos - JPA)
    ↓
MySQL Database
```

---

## 📝 Notas Importantes

- El gateway enruta requests según el prefijo de ruta (`/api/auth/*` → Auth Service, etc.)
- Cada microservicio tiene su propia base de datos (sin compartir datos directamente)
- La sincronización Auth ↔ Profile es **asincrónica** y tiene **Circuit Breaker** para tolerancia a fallos
- JWT se valida **localmente** en cada microservicio, no hay comunicación remota
