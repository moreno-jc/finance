---
tags:
  - roadmap
  - planning
  - timeline
  - gantt
created: '2026-03-01'
status: ready
---
# 🗺️ Roadmap

Tags: #roadmap #planning #mvp #timeline

---

## Timeline general

```mermaid
gantt
    title Finance App — MVP Roadmap
    dateFormat  YYYY-MM-DD
    section Fase 1 · Base
        Setup Expo + Supabase        :done,    f1a, 2026-03-02, 3d
        Autenticación (login/reg)    :done,    f1b, after f1a, 3d
        Navegación completa          :active,  f1c, after f1b, 2d
        Modelo de datos y seed       :         f1d, after f1c, 2d

    section Fase 2 · Core
        Dashboard UI                 :         f2a, after f1d, 4d
        CRUD Transacciones           :         f2b, after f2a, 4d
        Categorías predefinidas      :         f2c, after f2b, 2d

    section Fase 3 · Features
        Gráficas (Donut + Bar)       :         f3a, after f2c, 3d
        Reportes mensuales           :         f3b, after f3a, 2d
        Notificaciones push          :         f3c, after f3b, 3d
        Categorías personalizadas    :         f3d, after f3c, 2d

    section Fase 4 · Integración
        Edge Function ingest-tx      :         f4a, after f3d, 2d
        Testing con N8N              :         f4b, after f4a, 2d

    section Fase 5 · Polish
        UI/UX refinement             :         f5a, after f4b, 3d
        Bug fixes + QA               :         f5b, after f5a, 2d
        Build & deploy               :         f5c, after f5b, 1d
```

---

## Fases detalladas

### 🟦 Fase 1 — Base (Semana 1-2)

```mermaid
kanban
  column Todo
    Configurar N8N workflow de prueba
  column In Progress
    Setup Expo + TypeScript
    Supabase proyecto + variables env
    Navegación con Expo Router
    Auth guard en _layout
  column Done
    Definición de arquitectura
    Diseño de base de datos
    Documentación inicial
```

**Entregables:**
- Proyecto Expo inicializado con TypeScript
- Supabase conectado con Auth funcional
- Login y registro operativos
- Navegación entre pantallas (tabs + stacks)
- Tablas creadas con RLS activo
- Seed de categorías predefinidas

---

### 🟨 Fase 2 — Core (Semana 3-4)

**Entregables:**
- Dashboard mostrando datos reales desde Supabase
- CRUD completo de transacciones
- Formulario de nueva transacción con validación
- Filtros básicos (por tipo, por mes)
- Vista de lista de transacciones

```mermaid
flowchart LR
    D["Dashboard\nfuncional"] --> T["CRUD\nTransacciones"]
    T --> C["Categorías\npredefinidas"]
    C --> V["✅ Fase 2\nCompleta"]

    style V fill:#10b981,color:#fff
```

---

### 🟧 Fase 3 — Features (Semana 5)

**Entregables:**
- Gráfica de dona (distribución por categoría)
- Gráfica de barras (ingresos vs gastos por mes)
- Pantalla de reportes con selector de mes
- Notificaciones push configuradas
- Categorías personalizables por usuario

---

### 🟥 Fase 4 — Integración N8N (Semana 6 inicio)

**Entregables:**
- Edge Function `ingest-transaction` desplegada
- API Key configurada como secret en Supabase
- Workflow de N8N conectado y testeado
- Deduplicación por `external_id` verificada
- Manejo de errores y reintentos en N8N

---

### 🟪 Fase 5 — Polish & Deploy (Semana 6 fin)

**Entregables:**
- Revisión UX: transiciones, loading states, empty states
- Bug fixing general
- Build de producción con EAS Build (Expo)
- TestFlight (iOS) o APK interno (Android)

---

## Versiones futuras (post-MVP)

```mermaid
timeline
    title Finance App — Roadmap post-MVP
    v1.0 MVP : Dashboard minimalista
             : Transacciones manuales
             : Sync via N8N
             : Notificaciones básicas
    v1.1 : Metas de ahorro con progreso
         : Modo oscuro
         : Exportar a CSV
    v1.2 : Múltiples monedas
         : Presupuesto mensual por categoría
         : Widget de pantalla de inicio
    v2.0 : Sincronización bancaria directa (Open Banking)
         : IA para clasificación automática
         : Modo compartido (parejas / familia)
```

---

## Prioridad de features

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
    Auth: [0.2, 0.85]
    CRUD Transacciones: [0.35, 0.90]
    Gráficas: [0.45, 0.70]
    N8N Sync: [0.50, 0.80]
    Notificaciones: [0.40, 0.55]
    Categorías custom: [0.30, 0.50]
    Reportes: [0.55, 0.65]
    Modo oscuro: [0.25, 0.35]
    Exportar CSV: [0.35, 0.40]
    Open Banking: [0.90, 0.85]
    IA clasificación: [0.80, 0.75]
```

---

*[[README|← Volver al índice]] | [[Checklist MVP|Checklist →]]*
