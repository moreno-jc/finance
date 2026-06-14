---
name: semilla
description: Contexto comprimido del proyecto finance-app. Leer SIEMPRE antes de modificar cualquier archivo. Actualizar CORRECTIONS_LOG.md y PENDING_TASKS.md al terminar cada sesión de cambios.
---

# SEMILLA — Finance App Context

> **REGLA PARA AGENTES:** Lee este archivo al inicio. Actualiza `CORRECTIONS_LOG.md` y `PENDING_TASKS.md` al terminar cada sesión.

---

## Stack

| Capa | Tech |
|------|------|
| Mobile | React Native + Expo 54, expo-router 6 (file-based) |
| Estado | Zustand 5 |
| Backend | Supabase (Auth + PostgreSQL + Edge Functions) |
| Forms | react-hook-form 7 + Zod 4 |
| i18n | i18next + expo-localization |
| Charts | react-native-gifted-charts |
| Notifs | expo-notifications |
| Automatización | N8N → Supabase Edge Function |

---

## DB — Tablas (Supabase / PostgreSQL)

```
profiles          id, full_name, avatar_url, currency, created_at
categories        id, user_id, name, type*, icon, color, is_default, created_at
transactions      id, user_id, category_id, amount, type*, description, date,
                  is_recurring, recurrence**, source, external_id, created_at
notification_settings  id, user_id, type***, enabled, threshold
email_sync_log    id, user_id, gmail_message_id, parsed_transaction_id,
                  status****, raw_subject, created_at
```

```
* type:       'income'|'expense'|'saving'|'investment'|'debt'
** recurrence: 'daily'|'weekly'|'monthly'|'yearly'|null
*** notif:    'weekly_reminder'|'expense_alert'|'transaction_confirm'
**** status:  'success'|'failed'|'skipped'
```

Vista: `dashboard_summary` → `{user_id, month, income, expense, saving, investment, debt, net_balance}`

---

## Estructura real implementada

```
app/
  _layout.tsx                        ← auth guard + root
  (auth)/login.tsx                   ✅
  (auth)/register.tsx                ✅
  (app)/_layout.tsx                  ← bottom tabs
  (app)/index.tsx                    ← Dashboard ⚠️ parcial
  (app)/reports.tsx                  ❌ solo esqueleto
  (app)/transactions/index.tsx       ✅
  (app)/transactions/new.tsx         ✅
  (app)/transactions/[id].tsx        ✅
  (app)/settings/index.tsx           ⚠️ básico
  (app)/settings/categories.tsx      ⚠️ básico
  (app)/settings/notifications.tsx   ⚠️ básico

src/
  components/
    ui/           AppHeader, Badge, Button, Card, CategoryIcon,
                  ConfirmModal, EmptyState, Input, TabBar
    dashboard/    BalanceCard, ComparisonCards, DateHeader, RecentTransactions
    transactions/ FilterModal, SearchBar, TransactionForm,
                  TransactionList, CreateCategoryModal
    charts/       DashboardCharts
  services/       supabase.ts, authService.ts, transactionService.ts
  store/          authStore.ts, transactionStore.ts
  hooks/          useAuth.ts
  types/          database.ts, app.ts, filters.ts
  constants/      categories.ts, theme.ts

supabase/
  schema.sql
  functions/      (Edge Function pendiente)
```

---

## Estado de módulos (2026-06-13)

| Módulo | Estado | Notas |
|--------|--------|-------|
| Auth | ✅ completo | login, register, guard, store |
| Dashboard | ⚠️ parcial | UI hecha, falta dashboardService real |
| Transacciones CRUD | ⚠️ parcial | UI hecha, transactionService necesita revisión |
| Reportes | ❌ pendiente | solo esqueleto |
| Categorías custom | ⚠️ parcial | UI básica, falta categoryService |
| Notificaciones | ❌ pendiente | falta useNotifications + permisos |
| Edge Function N8N | ❌ pendiente | no existe aún |
| i18n | ⚠️ instalado | falta cobertura completa de strings |
| Gráficas | ⚠️ parcial | DashboardCharts hecho, reportes no |
| Deploy / EAS | ❌ pendiente | |

---

## Patrones del proyecto

- Screen → Hook → Store + Service → Supabase
- Zustand para estado global; no usar Context API
- Validación con Zod en formularios via `@hookform/resolvers/zod`
- `src/types/database.ts` es la fuente de verdad de tipos DB
- Path aliases configurados en `tsconfig.json`

---

## Archivos de seguimiento

- [`CORRECTIONS_LOG.md`](./CORRECTIONS_LOG.md) — log de cada corrección realizada
- [`PENDING_TASKS.md`](./PENDING_TASKS.md) — checklist vivo de tareas pendientes

---

## Protocolo para agentes

1. **Leer este archivo** antes de cualquier cambio.
2. Si cambias arquitectura, DB o stack → actualiza esta `SKILL.md`.
3. **Al terminar**, agrega una entrada en `CORRECTIONS_LOG.md`: fecha, qué cambió, por qué.
4. **Actualiza `PENDING_TASKS.md`**: marca completado lo que hiciste, agrega tareas nuevas detectadas.
