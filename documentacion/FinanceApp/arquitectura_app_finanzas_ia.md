# Arquitectura — Finance App IA

## Stack Tecnológico

| Capa           | Tecnología                       | Justificación                            |
| -------------- | -------------------------------- | ---------------------------------------- |
| Mobile         | React Native + Expo              | Desarrollo rápido multiplataforma        |
| Routing        | Expo Router (file-based)         | Navegación declarativa tipo Next.js      |
| Estado global  | Zustand                          | Ligero, sin boilerplate                  |
| Backend / Auth | Supabase                         | Auth + DB + Edge Functions en uno        |
| Auth social    | Google OAuth (Supabase + Expo)   | Sign-in con Google + acceso Gmail API    |
| Base de datos  | PostgreSQL (Supabase)            | Relacional, RLS nativo                   |
| Gmail sync     | Gmail API via Edge Function      | Lee correos bancarios con token del user |
| Gráficas       | Victory Native / Gifted Charts   | Compatibles con React Native             |
| Notificaciones | Expo Notifications               | Integrado con Expo                       |

---

## Diagrama de Arquitectura General

```mermaid
graph TD
    subgraph Cliente["📱 React Native App (Expo)"]
        UI[Pantallas / Screens]
        Hooks[Custom Hooks]
        Store[Zustand Store]
        Services[Services Layer]
    end

    subgraph Google["🔵 Google"]
        GAuth[Google OAuth]
        Gmail[Gmail API]
    end

    subgraph Supabase["☁️ Supabase"]
        Auth[Auth Service]
        DB[(PostgreSQL + RLS)]
        Edge[Edge Functions]
        Realtime[Realtime]
    end

    UI --> Hooks
    Hooks --> Store
    Store --> Services
    Services --> Auth
    Services --> DB
    Services --> Edge

    DB --> Realtime
    Realtime -.->|push updates| Store

    UI -->|Google OAuth| GAuth
    GAuth -->|token| Auth
    Auth -->|google_provider_token| DB

    Edge -->|usa google_provider_token| Gmail
    Gmail -->|correos bancarios| Edge
    Edge -->|UPSERT transactions| DB

    style Cliente fill:#1e1b4b,color:#fff
    style Google fill:#1a3c6b,color:#fff
    style Supabase fill:#064e3b,color:#fff
```

---

## Flujo de Datos (Patrón por capas)

```mermaid
graph LR
    Screen["🖥️ Screen"] -->|llama| Hook["🪝 Hook"]
    Hook -->|lee/escribe| Store["🗄️ Zustand Store"]
    Hook -->|fetch async| Service["⚙️ Service"]
    Service -->|query / mutation| Supabase["☁️ Supabase"]
    Supabase -->|data| Service
    Service -->|actualiza| Store
    Store -->|reactivo| Screen

    style Screen fill:#6366f1,color:#fff
    style Hook fill:#8b5cf6,color:#fff
    style Store fill:#ec4899,color:#fff
    style Service fill:#f59e0b,color:#fff
    style Supabase fill:#10b981,color:#fff
```

---

## Flujo de Autenticación con Google

```mermaid
sequenceDiagram
    participant App as 📱 App
    participant Expo as Expo AuthSession
    participant Google as 🔵 Google OAuth
    participant SB as Supabase Auth
    participant DB as PostgreSQL

    App->>Expo: promptAsync() — abre Google
    Expo->>Google: OAuth consent screen
    Google-->>Expo: { id_token, access_token }
    Expo-->>App: id_token + google_provider_token
    App->>SB: signInWithIdToken({ provider: 'google', token: id_token })
    SB->>DB: trigger handle_new_user() si es primer login
    DB-->>DB: INSERT into profiles
    SB-->>App: session + JWT

    Note over App,DB: google_provider_token se guarda en profiles
    App->>DB: UPDATE profiles SET google_provider_token = ?
```

---

## Flujo de Sincronización Gmail

```mermaid
sequenceDiagram
    participant App as 📱 App
    participant Edge as ⚡ Edge Function
    participant Gmail as 🔵 Gmail API
    participant DB as 🐘 PostgreSQL

    App->>Edge: POST /sync-gmail { user_id }
    Edge->>DB: SELECT google_provider_token FROM profiles WHERE id = user_id
    DB-->>Edge: google_provider_token
    Edge->>Gmail: GET /gmail/v1/users/me/messages?q=from:banco
    Gmail-->>Edge: lista de mensajes
    Edge->>Edge: Parsear: monto, tipo, fecha, descripción
    Edge->>DB: UPSERT transactions ON CONFLICT gmail_message_id
    DB-->>Edge: { inserted: N }
    Edge-->>App: { ok: true, inserted: N }

    Note over App,DB: App refresca dashboard con nuevas transacciones
```

---

## Estructura de Carpetas

```
finance-app/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/
│   │   └── login.tsx             # Login con Google
│   ├── (app)/                    # Rutas protegidas
│   │   ├── _layout.tsx           # Tab navigator
│   │   ├── index.tsx             # Dashboard / Home
│   │   ├── transactions/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── new.tsx
│   │   ├── reports.tsx
│   │   └── settings/
│   │       ├── index.tsx
│   │       ├── categories.tsx
│   │       └── notifications.tsx
│   └── _layout.tsx               # Root layout + auth guard
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Button, Card, Input, Badge, Toast, etc.
│   │   ├── dashboard/            # SummaryCard, FinanceRow, QuickStats
│   │   ├── transactions/         # TransactionItem, TransactionForm, FilterBar
│   │   └── charts/               # DonutChart, BarChart
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── transactionStore.ts
│   │   └── categoryStore.ts
│   ├── services/
│   │   ├── supabase.ts           # Cliente Supabase
│   │   ├── authService.ts        # Google OAuth + Supabase auth
│   │   ├── transactionService.ts
│   │   ├── categoryService.ts
│   │   └── dashboardService.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDashboard.ts
│   │   ├── useTransactions.ts
│   │   ├── useReports.ts
│   │   └── useNotifications.ts
│   ├── types/
│   │   ├── database.ts           # Tipos generados por Supabase CLI
│   │   └── app.ts
│   └── constants/
│       ├── categories.ts
│       ├── colors.ts
│       └── theme.ts
│
├── supabase/
│   └── functions/
│       └── sync-gmail/
│           └── index.ts          # Edge Function: Gmail API → transactions
│
└── assets/
```

---

## Mapa de Pantallas y Navegación

```mermaid
graph TD
    Root["_layout.tsx — Auth Guard"] --> Auth
    Root --> AppTabs

    subgraph Auth["(auth)"]
        Login["login.tsx — Google Sign-In"]
    end

    subgraph AppTabs["(app) — Bottom Tabs"]
        Home["index.tsx — Dashboard"]
        TxList["transactions/ — Transacciones"]
        Reports["reports.tsx — Reportes"]
        Settings["settings/ — Config"]
    end

    TxList --> TxNew["transactions/new.tsx"]
    TxList --> TxDetail["transactions/[id].tsx"]
    Settings --> SettingsCat["settings/categories.tsx"]
    Settings --> SettingsNotif["settings/notifications.tsx"]

    style Home fill:#6366f1,color:#fff
    style TxList fill:#8b5cf6,color:#fff
    style Reports fill:#0ea5e9,color:#fff
    style Settings fill:#f59e0b,color:#fff
```

---

## Actores y Casos de Uso

```mermaid
graph TD
    Actor["👤 Usuario"]

    subgraph Auth["🔐 Autenticación"]
        UC1["Sign-in con Google"]
        UC2["Cerrar sesión"]
    end

    subgraph Dashboard["📊 Dashboard"]
        UC3["Ver resumen financiero"]
        UC4["Ver balance total"]
        UC5["Sincronizar Gmail"]
    end

    subgraph Transacciones["💸 Transacciones"]
        UC6["Agregar transacción manual"]
        UC7["Editar transacción"]
        UC8["Eliminar transacción"]
        UC9["Filtrar transacciones"]
    end

    subgraph Reportes["📈 Reportes"]
        UC10["Ver reporte mensual"]
        UC11["Ver distribución por categoría"]
        UC12["Comparar meses"]
    end

    subgraph Config["⚙️ Configuración"]
        UC13["Gestionar categorías"]
        UC14["Configurar notificaciones"]
        UC15["Editar perfil"]
    end

    Actor --> UC1 & UC2
    Actor --> UC3 & UC5 & UC6 & UC9 & UC10 & UC13 & UC14 & UC15
    UC3 --> UC4
    UC10 --> UC11 & UC12
```

### Prioridad de pantallas

| Pantalla | Ruta | Prioridad |
|---|---|---|
| Login Google | `/auth/login` | Alta |
| Dashboard | `/` | Alta |
| Nueva transacción | `/transactions/new` | Alta |
| Lista transacciones | `/transactions` | Alta |
| Editar transacción | `/transactions/[id]` | Media |
| Reportes | `/reports` | Media |
| Categorías | `/settings/categories` | Media |
| Notificaciones | `/settings/notifications` | Baja |
| Perfil | `/settings` | Baja |

---

## Contrato del Edge Function: sync-gmail

```
POST https://<project>.supabase.co/functions/v1/sync-gmail

Headers:
  Authorization: Bearer <supabase_jwt>
  Content-Type: application/json

Body:
{
  "user_id": "uuid-del-usuario"
}

Response 200:
{ "ok": true, "inserted": 3, "skipped": 1 }

Response 401: Unauthorized (token inválido o expirado)
Response 400: { "error": "user_id requerido" }
Response 500: { "error": "..." }
```

La Edge Function:
1. Lee `google_provider_token` desde `profiles`
2. Llama Gmail API con filtros bancarios (`from:notificaciones@bbva.com`, etc.)
3. Parsea asunto/cuerpo con regex o IA
4. Hace UPSERT en `transactions` con `ON CONFLICT (gmail_message_id)`
