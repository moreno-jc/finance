# Roadmap MVP — Finance App IA

## Timeline General

```mermaid
gantt
    title Finance App — MVP Roadmap
    dateFormat  YYYY-MM-DD
    section Fase 1 · Base
        Setup Expo + Supabase        :done,    f1a, 2026-03-02, 3d
        Google OAuth (login)         :done,    f1b, after f1a, 3d
        Navegación completa          :active,  f1c, after f1b, 2d
        Modelo de datos y seed       :         f1d, after f1c, 2d

    section Fase 2 · Core
        Dashboard UI                 :         f2a, after f1d, 4d
        CRUD Transacciones           :         f2b, after f2a, 4d
        Categorías predefinidas      :         f2c, after f2b, 2d

    section Fase 3 · Integración Google
        Edge Function sync-gmail     :         f3a, after f2c, 3d
        Parseo correos bancarios     :         f3b, after f3a, 2d
        Refresh token + manejo error :         f3c, after f3b, 2d

    section Fase 4 · Features
        Gráficas (Donut + Bar)       :         f4a, after f3c, 3d
        Reportes mensuales           :         f4b, after f4a, 2d
        Notificaciones push          :         f4c, after f4b, 2d
        Categorías personalizadas    :         f4d, after f4c, 2d

    section Fase 5 · Polish
        UI/UX refinement             :         f5a, after f4d, 3d
        Bug fixes + QA               :         f5b, after f5a, 2d
        Build & deploy               :         f5c, after f5b, 1d
```

---

## Fases Detalladas

### Fase 1 — Base (Semana 1-2)

**Entregables:**
- Proyecto Expo inicializado con TypeScript
- Google OAuth funcional (Supabase Auth + `expo-auth-session`)
- Login y acceso a la app operativos
- Navegación entre pantallas (tabs + stacks)
- Tablas creadas con RLS activo
- Seed de categorías predefinidas

```mermaid
flowchart LR
    A["Expo + TS"] --> B["Supabase\nproyecto"]
    B --> C["Google OAuth\nlogin"]
    C --> D["Navegación\nExpo Router"]
    D --> E["DB + RLS\n+ seed"]
    E --> F["✅ Fase 1"]
    style F fill:#10b981,color:#fff
```

---

### Fase 2 — Core (Semana 3-4)

**Entregables:**
- Dashboard mostrando datos reales desde Supabase
- CRUD completo de transacciones
- Formulario de nueva transacción con validación
- Filtros básicos (por tipo, por mes, por categoría)
- Vista de lista de transacciones con paginación

---

### Fase 3 — Integración Google / Gmail (Semana 5)

**Entregables:**
- Edge Function `sync-gmail` desplegada en Supabase
- `google_provider_token` guardado y refrescado desde la app
- Parseo de correos bancarios (BBVA, Citibanamex, HSBC, Santander, Banorte)
- UPSERT con `ON CONFLICT (gmail_message_id)` para evitar duplicados
- Botón "Sincronizar Gmail" en la app con feedback visual
- Manejo de token expirado (re-autenticación silenciosa)

```mermaid
sequenceDiagram
    participant App as 📱 App
    participant SB as Supabase Auth
    participant Edge as Edge Function
    participant Gmail as Gmail API
    participant DB as PostgreSQL

    App->>SB: getSession() → google_provider_token
    App->>Edge: POST /sync-gmail { user_id }
    Edge->>DB: SELECT google_provider_token
    Edge->>Gmail: GET messages (filtro bancario)
    Gmail-->>Edge: lista correos
    Edge->>Edge: parsear monto, tipo, fecha
    Edge->>DB: UPSERT transactions
    Edge-->>App: { inserted: N }
    App-->>App: refresh dashboard
```

**Bancos a soportar (parseo regex):**

| Banco | Remitente | Patrón |
|---|---|---|
| BBVA | notificaciones@bbva.com | `Cargo por \$[\d,]+` |
| Citibanamex | alertas@citibanamex.com | `Compra por \$[\d,]+` |
| HSBC | alertas@hsbc.com.mx | `Cargo: \$[\d,]+` |
| Santander | alertas@santander.com.mx | `Movimiento: -\$[\d,]+` |
| Banorte | notificaciones@banorte.com | `Retiro \$[\d,]+` |

---

### Fase 4 — Features (Semana 6)

**Entregables:**
- Gráfica de dona (distribución por categoría)
- Gráfica de barras (ingresos vs gastos por mes)
- Pantalla de reportes con selector de mes y comparativa
- Notificaciones push (semanal + alerta de gastos > umbral)
- Categorías personalizables por usuario

---

### Fase 5 — Polish & Deploy (Semana 7)

**Entregables:**
- Revisión UX: transiciones, loading states, empty states
- Bug fixing general
- Build de producción con EAS Build
- TestFlight (iOS) / APK interno (Android)

---

## Versiones Futuras (post-MVP)

```mermaid
timeline
    title Finance App — Roadmap post-MVP
    v1.0 MVP : Dashboard minimalista
             : Transacciones manuales
             : Sync via Gmail API
             : Notificaciones básicas
    v1.1 : Metas de ahorro con progreso
         : Modo oscuro
         : Exportar a CSV
    v1.2 : Múltiples monedas
         : Presupuesto mensual por categoría
         : Widget pantalla de inicio
    v2.0 : IA para clasificación automática
         : Sincronización bancaria directa (Open Banking)
         : Modo compartido (parejas / familia)
```

---

## Prioridad de Features (Impacto vs Esfuerzo)

```mermaid
quadrantChart
    title Features: Impacto vs Esfuerzo
    x-axis Bajo Esfuerzo --> Alto Esfuerzo
    y-axis Bajo Impacto --> Alto Impacto
    quadrant-1 Planificar con cuidado
    quadrant-2 Quick wins
    quadrant-3 Deprioritizar
    quadrant-4 Proyectos grandes
    Dashboard: [0.2, 0.95]
    Google OAuth: [0.25, 0.90]
    CRUD Transacciones: [0.35, 0.90]
    Gmail Sync: [0.50, 0.85]
    Gráficas: [0.45, 0.70]
    Notificaciones: [0.40, 0.55]
    Categorías custom: [0.30, 0.50]
    Reportes: [0.55, 0.65]
    Modo oscuro: [0.25, 0.35]
    Exportar CSV: [0.35, 0.40]
    Open Banking: [0.90, 0.85]
    IA clasificación: [0.80, 0.75]
```
