---
tags:
  - casos-de-uso
  - uml
  - flujos
  - diagramas
created: '2026-03-01'
status: ready
---
# 🎭 Casos de Uso

Tags: #casos-de-uso #uml #flujos #usuario

---

## Actores del sistema

```mermaid
graph LR
    U["👤 Usuario"]
    N["🤖 N8N"]
    G["📧 Gmail"]
    S["☁️ Supabase"]

    U -->|"usa"| APP["📱 Finance App"]
    N -->|"alimenta datos"| S
    G -->|"trigger emails"| N
    APP -->|"lee/escribe"| S

    style U fill:#6366f1,color:#fff
    style N fill:#f59e0b,color:#fff
    style G fill:#ef4444,color:#fff
    style S fill:#10b981,color:#fff
    style APP fill:#8b5cf6,color:#fff
```

---

## Diagrama de Casos de Uso General

```mermaid
graph TD
    Actor["👤 Usuario"]

    subgraph Auth["🔐 Autenticación"]
        UC1["Registrarse"]
        UC2["Iniciar sesión"]
        UC3["Cerrar sesión"]
    end

    subgraph Dashboard["📊 Dashboard"]
        UC4["Ver resumen financiero"]
        UC5["Ver balance total"]
        UC6["Ver gráficas del mes"]
    end

    subgraph Transacciones["💸 Transacciones"]
        UC7["Agregar transacción manual"]
        UC8["Editar transacción"]
        UC9["Eliminar transacción"]
        UC10["Filtrar transacciones"]
        UC11["Ver detalle de transacción"]
    end

    subgraph Reportes["📈 Reportes"]
        UC12["Ver reporte mensual"]
        UC13["Comparar meses"]
        UC14["Ver distribución por categoría"]
    end

    subgraph Config["⚙️ Configuración"]
        UC15["Gestionar categorías"]
        UC16["Crear categoría custom"]
        UC17["Configurar notificaciones"]
        UC18["Editar perfil"]
    end

    Actor --> UC1
    Actor --> UC2
    Actor --> UC3
    Actor --> UC4
    Actor --> UC7
    Actor --> UC8
    Actor --> UC9
    Actor --> UC10
    Actor --> UC12
    Actor --> UC15
    Actor --> UC16
    Actor --> UC17
    Actor --> UC18

    UC4 --> UC5
    UC4 --> UC6
    UC12 --> UC13
    UC12 --> UC14
```

---

## Casos de Uso: Autenticación

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant App as 📱 App
    participant SB as ☁️ Supabase Auth

    Note over U,SB: Registro
    U->>App: Ingresa email + contraseña
    App->>SB: signUp(email, password)
    SB-->>SB: Crea auth.user + trigger profile
    SB-->>App: Session token
    App-->>U: Redirige al Dashboard

    Note over U,SB: Login
    U->>App: Ingresa credenciales
    App->>SB: signIn(email, password)
    SB-->>App: Session + JWT
    App-->>U: Dashboard cargado

    Note over U,SB: Auth Guard
    U->>App: Intenta acceder a ruta protegida
    App->>SB: getSession()
    alt Sin sesión
        SB-->>App: null
        App-->>U: Redirige a /login
    else Con sesión
        SB-->>App: session válida
        App-->>U: Acceso permitido
    end
```

---

## Casos de Uso: Dashboard

```mermaid
sequenceDiagram
    participant U as 👤 Usuario
    participant App as 📱 App
    participant Hook as 🪝 useDashboard
    participant SB as ☁️ Supabase

    U->>App: Abre la app / navega a Home
    App->>Hook: mount()
    Hook->>SB: SELECT * FROM dashboard_summary WHERE user_id = ? AND month = ?
    SB-->>Hook: { total_income, total_expense, total_saving, total_investment, total_debt, net_balance }
    Hook-->>App: estado actualizado
    App-->>U: Render cards + gráfica

    U->>App: Cambia mes (selector)
    App->>Hook: setMonth(newMonth)
    Hook->>SB: nueva query con mes seleccionado
    SB-->>Hook: datos del mes
    Hook-->>App: re-render
    App-->>U: Dashboard actualizado
```

---

## Casos de Uso: Agregar Transacción Manual

```mermaid
flowchart TD
    Start(["👤 Usuario toca +"]) --> Form["📝 Formulario\nNueva Transacción"]
    Form --> Input["Llena: monto, tipo,\ncategoría, fecha, nota"]
    Input --> Validate{¿Datos válidos?}
    Validate -->|No| Error["⚠️ Mostrar errores\nde validación"]
    Error --> Input
    Validate -->|Sí| Save["💾 INSERT en transactions\nsource: 'manual'"]
    Save --> Success{¿OK?}
    Success -->|Error| Retry["🔴 Toast: Error al guardar"]
    Success -->|OK| Toast["✅ Toast: Transacción guardada"]
    Toast --> Dashboard["🔄 Invalidar cache\ny actualizar Dashboard"]
    Dashboard --> End(["📊 Dashboard actualizado"])
```

---

## Casos de Uso: Sincronización N8N (automática)

```mermaid
sequenceDiagram
    participant Gmail as 📧 Gmail
    participant N8N as 🤖 N8N
    participant Edge as ⚡ Edge Function
    participant DB as 🐘 PostgreSQL
    participant App as 📱 App

    Gmail->>N8N: Nuevo correo (ej: BBVA - Cargo $450)
    N8N->>N8N: Filtrar por remitente bancario
    N8N->>N8N: Parsear: amount, type, description, date
    N8N->>Edge: POST /ingest-transaction\n{ user_id, transactions[], x-api-key }
    Edge->>Edge: Validar API Key
    Edge->>DB: UPSERT (ON CONFLICT external_id DO NOTHING)

    alt Transacción nueva
        DB-->>Edge: inserted: 1
        Edge-->>N8N: { ok: true, inserted: 1 }
    else Duplicado
        DB-->>Edge: inserted: 0
        Edge-->>N8N: { ok: true, inserted: 0 }
    end

    Note over App: Próximo fetch del usuario
    App->>DB: GET transactions (Realtime o polling)
    DB-->>App: Incluye nueva transacción
    App-->>App: Dashboard actualizado automáticamente
```

---

## Casos de Uso: Reportes

```mermaid
flowchart LR
    U["👤 Usuario"] --> R["📈 Pantalla Reportes"]
    R --> M["Selecciona mes"]
    M --> Q1["Query:\nGastos por categoría"]
    M --> Q2["Query:\nIngresos vs Gastos"]
    Q1 --> D["🍩 Donut Chart\npor categoría"]
    Q2 --> B["📊 Bar Chart\ncomparativo"]
    D --> UI["Render en pantalla"]
    B --> UI
```

---

## Casos de Uso: Notificaciones

```mermaid
stateDiagram-v2
    [*] --> Idle: App en segundo plano

    Idle --> CheckExpenses: Cron diario (Expo Background)
    CheckExpenses --> CalcRatio: Calcular gastos/ingresos del mes
    CalcRatio --> Alert: gastos > 80% ingresos
    CalcRatio --> Idle: gastos <= 80%
    Alert --> Notify: Enviar push notification
    Notify --> Idle

    Idle --> WeeklyReminder: Cada lunes 9am
    WeeklyReminder --> Notify2: "¿Registraste tus gastos?"
    Notify2 --> Idle

    Idle --> TransactionSaved: Usuario guarda transacción
    TransactionSaved --> Confirm: Toast in-app confirmación
    Confirm --> Idle
```

---

## Matriz de Casos de Uso vs Pantallas

| Caso de Uso | Pantalla | Prioridad |
|---|---|---|
| Registrarse / Login | `/auth/login`, `/auth/register` | 🔴 Alta |
| Ver Dashboard | `/` (Home) | 🔴 Alta |
| Agregar transacción | `/transactions/new` | 🔴 Alta |
| Ver lista transacciones | `/transactions` | 🔴 Alta |
| Editar / Eliminar transacción | `/transactions/[id]` | 🟡 Media |
| Ver reportes | `/reports` | 🟡 Media |
| Gestionar categorías | `/settings/categories` | 🟡 Media |
| Configurar notificaciones | `/settings/notifications` | 🟢 Baja |
| Editar perfil | `/settings` | 🟢 Baja |

---

*[[README|← Volver al índice]] | [[Roadmap|Roadmap →]]*
