---
tags:
  - finance-app
  - mvp
  - react-native
created: '2026-03-01'
status: in-progress
---
# 💰 Finance App — Documentación General

> App personal de finanzas con dashboard minimalista, sincronización automática via Gmail → N8N → Supabase y visualización de gastos, ingresos, ahorros, inversiones y deudas.

---

## 📁 Índice de documentación

| Documento | Descripción | Estado |
|---|---|---|
| [[Arquitectura]] | Stack, carpetas y flujo de datos | ✅ |
| [[Base de Datos]] | Esquema SQL, RLS y vistas | ✅ |
| [[Casos de Uso]] | Diagrama UML de actores y flujos | ✅ |
| [[Roadmap]] | Fases de desarrollo y timeline | ✅ |
| [[Checklist MVP]] | Lista de tareas por módulo | ✅ |
| [[Prompts/README Prompts\|Prompts para AI Editor]] | Prompts listos para Cursor/Windsurf | ✅ |

---

## 🎯 Visión del producto

App **personal** de finanzas enfocada en un dashboard minimalista que muestra el estado financiero completo en un vistazo. Las transacciones pueden ingresarse manualmente o sincronizarse automáticamente desde correos bancarios via N8N.

---

## 🧩 Módulos principales

```mermaid
mindmap
  root((Finance App))
    Dashboard
      Balance total
      Cards por categoría
      Gráficas donut y barra
    Transacciones
      Ingreso manual
      Sync via N8N
      Filtros y búsqueda
    Reportes
      Resumen mensual
      Por categoría
      Tendencias
    Configuración
      Perfil usuario
      Categorías custom
      Notificaciones
    Integración
      N8N Workflow
      Gmail Parser
      Edge Function
```

---

## 🏗️ Stack de un vistazo

```mermaid
graph LR
    RN["📱 React Native\n+ Expo"] --> SB["☁️ Supabase\nAuth + DB + Functions"]
    N8N["🤖 N8N"] -->|ingest-transaction| SB
    SB --> PG[("🐘 PostgreSQL")]

    style RN fill:#6366f1,color:#fff
    style SB fill:#10b981,color:#fff
    style N8N fill:#f59e0b,color:#fff
    style PG fill:#3b82f6,color:#fff
```

---

## 📊 Métricas del MVP

| Métrica | Meta |
|---|---|
| Pantallas | 6 |
| Semanas de desarrollo | 6 |
| Bancos soportados (N8N) | 5 |
| Categorías predefinidas | 12 |

---

*Última actualización: 2026-03-01*
