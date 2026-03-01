---
tags:
  - arquitectura
  - react-native
  - supabase
  - n8n
  - expo
created: '2026-03-01'
status: ready
---
# 🏗️ Arquitectura del Sistema

Tags: #arquitectura #react-native #supabase #n8n #expo

---

## Stack Tecnológico

| Capa           | Tecnología                     | Justificación                            |
| -------------- | ------------------------------ | ---------------------------------------- |
| Mobile         | React Native + Expo            | Desarrollo rápido multiplataforma        |
| Routing        | Expo Router (file-based)       | Navegación declarativa tipo Next.js      |
| Estado global  | Zustand                        | Ligero, sin boilerplate                  |
| Backend / Auth | Supabase                       | Auth + DB + Edge Functions en uno        |
| Base de datos  | PostgreSQL (Supabase)          | Relacional, RLS nativo                   |
| Gráficas       | Victory Native / Gifted Charts | Compatibles con RN                       |
| Notificaciones | Expo Notifications             | Integrado con Expo                       |
| Automatización | N8N                            | Orquesta Gmail → Supabase invisiblemente |

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

    subgraph Supabase["☁️ Supabase"]
        Auth[Auth Service]
        DB[(PostgreSQL + RLS)]
        Edge[Edge Functions]
        Realtime[Realtime]
    end

    subgraph N8N["🤖 N8N Workflow (externo)"]
        Gmail[Gmail Trigger]
        Parser[Parser Node]
        HTTP[HTTP Request Node]
    end

    UI --> Hooks
    Hooks --> Store
    Store --> Services
    Services --> Auth
    Services --> DB
    Services --> Edge
    DB --> Realtime
    Realtime -.->|"push updates"| Store

    Gmail --> Parser
    Parser --> HTTP
    HTTP -->|"POST /ingest-transaction\n+ x-api-key"| Edge
    Edge --> DB

    UI -->|"OAuth"| Auth

    style Cliente fill:#1e1b4b,color:#fff
    style Supabase fill:#064e3b,color:#fff
    style N8N fill:#451a03,color:#fff
```

---

## Flujo de Datos (Patrón por capas)

```mermaid
graph LR
    Screen["🖥️ Screen"] -->|"llama"| Hook["🪝 Hook"]
    Hook -->|"lee/escribe"| Store["🗄️ Zustand Store"]
    Hook -->|"fetch async"| Service["⚙️ Service"]
    Service -->|"query / mutation"| Supabase["☁️ Supabase"]
    Supabase -->|"data"| Service
    Service -->|"actualiza"| Store
    Store -->|"reactivo"| Screen

    style Screen fill:#6366f1,color:#fff
    style Hook fill:#8b5cf6,color:#fff
    style Store fill:#ec4899,color:#fff
    style Service fill:#f59e0b,color:#fff
    style Supabase fill:#10b981,color:#fff
```

---

## Flujo de Autenticación

```mermaid
sequenceDiagram
    participant App as 📱 App
    participant Guard as Auth Guard
    participant SB as Supabase Auth
    participant DB as PostgreSQL

    App->>Guard: Navega a ruta protegida
    Guard->>SB: getSession()
    alt Sin sesión
        SB-->>Guard: null
        Guard-->>App: redirect → /login
    else Con sesión válida
        SB-->>Guard: JWT válido
        Guard-->>App: acceso permitido
    end

    Note over App,DB: Post-registro
    App->>SB: signUp(email, password)
    SB->>DB: trigger handle_new_user()
    DB-->>DB: INSERT into profiles
    SB-->>App: session token
```

---

## Flujo de Sincronización N8N

```mermaid
sequenceDiagram
    participant Gmail as 📧 Gmail
    participant N8N as 🤖 N8N
    participant Edge as ⚡ Edge Function
    participant DB as 🐘 PostgreSQL
    participant App as 📱 App

    Gmail->>N8N: Nuevo correo bancario
    N8N->>N8N: Parsear: monto, tipo, fecha, descripción
    N8N->>Edge: POST /ingest-transaction\n{ user_id, transactions[], x-api-key }
    Edge->>Edge: Validar API Key
    Edge->>DB: UPSERT ON CONFLICT external_id
    DB-->>Edge: { inserted: N }
    Edge-->>N8N: { ok: true, inserted: N }
    Note over App,DB: Próximo fetch del usuario
    DB-->>App: Transacciones actualizadas
```

---

## Estructura de Carpetas

```
finance-app/
├── app/                          # Expo Router (file-based routing)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (app)/                    # Rutas protegidas
│   │   ├── _layout.tsx           # Tab navigator
│   │   ├── index.tsx             # Dashboard / Home
│   │   ├── transactions/
│   │   │   ├── index.tsx         # Lista de transacciones
│   │   │   ├── [id].tsx          # Detalle / editar
│   │   │   └── new.tsx           # Nueva transacción
│   │   ├── reports.tsx           # Gráficas y reportes
│   │   └── settings/
│   │       ├── index.tsx         # Perfil
│   │       ├── categories.tsx    # Gestión de categorías
│   │       └── notifications.tsx # Config notificaciones
│   └── _layout.tsx               # Root layout + auth guard
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Componentes base reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ConfirmModal.tsx
│   │   ├── dashboard/
│   │   │   ├── SummaryCard.tsx   # Balance total
│   │   │   ├── FinanceRow.tsx    # Fila por categoría
│   │   │   └── QuickStats.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionItem.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── FilterBar.tsx
│   │   └── charts/
│   │       ├── DonutChart.tsx
│   │       └── BarChart.tsx
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── transactionStore.ts
│   │   └── categoryStore.ts
│   │
│   ├── services/
│   │   ├── supabase.ts           # Cliente Supabase
│   │   ├── authService.ts
│   │   ├── transactionService.ts
│   │   ├── categoryService.ts
│   │   └── dashboardService.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useDashboard.ts
│   │   ├── useTransactions.ts
│   │   ├── useReports.ts
│   │   └── useNotifications.ts
│   │
│   ├── types/
│   │   ├── database.ts           # Tipos generados por Supabase CLI
│   │   └── app.ts                # Tipos propios de la app
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── formatDate.ts
│   │   └── calculateBalance.ts
│   │
│   └── constants/
│       ├── categories.ts         # Categorías predefinidas
│       ├── colors.ts
│       └── theme.ts
│
├── supabase/
│   └── functions/
│       └── ingest-transaction/
│           └── index.ts          # Edge Function para N8N
│
└── assets/
    ├── fonts/
    └── images/
```

---

## Mapa de pantallas y navegación

```mermaid
graph TD
    Root["_layout.tsx\nAuth Guard"] --> Auth
    Root --> AppTabs

    subgraph Auth["(auth)"]
        Login["login.tsx"]
        Register["register.tsx"]
        Login <-->|"link"| Register
    end

    subgraph AppTabs["(app) — Bottom Tabs"]
        Home["index.tsx\n📊 Dashboard"]
        TxList["transactions/\nindex.tsx\n💸 Transacciones"]
        Reports["reports.tsx\n📈 Reportes"]
        Settings["settings/\nindex.tsx\n⚙️ Config"]
    end

    TxList --> TxNew["transactions/new.tsx\n➕ Nueva"]
    TxList --> TxDetail["transactions/[id].tsx\n✏️ Editar"]
    Settings --> SettingsCat["settings/categories.tsx"]
    Settings --> SettingsNotif["settings/notifications.tsx"]

    style Home fill:#6366f1,color:#fff
    style TxList fill:#8b5cf6,color:#fff
    style Reports fill:#0ea5e9,color:#fff
    style Settings fill:#f59e0b,color:#fff
```

---

## Contrato del Endpoint N8N

```
POST https://<project>.supabase.co/functions/v1/ingest-transaction

Headers:
  x-api-key: <INGEST_API_KEY>
  Content-Type: application/json

Body:
{
  "user_id": "uuid-del-usuario",
  "transactions": [
    {
      "gmail_message_id": "18c4f2a...",
      "amount": 450.00,
      "type": "expense",
      "description": "Starbucks Reforma",
      "date": "2026-03-01",
      "category_id": null
    }
  ]
}

Response 200:
{ "ok": true, "inserted": 1 }

Response 401: Unauthorized
Response 400: Bad Request
Response 500: { "error": "..." }
```

---

## Links relacionados

- [[Base de Datos]] — Esquema SQL completo y ERD
- [[Casos de Uso]] — Diagramas de flujo por feature
- [[Roadmap]] — Timeline de desarrollo
- [[Checklist MVP]] — Tasks por módulo

---

*[[README|← Volver al índice]]*
