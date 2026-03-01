---
tags:
  - prompt
  - master
  - contexto
created: '2026-03-01'
step: 0
---
# 🧠 Prompt 00 — Master Context (Prompt General)

Tags: #prompt #master #contexto-general

> **Uso:** Pega este prompt al inicio de cualquier sesión nueva en tu editor de IA (Cursor, Windsurf, etc.) para darle todo el contexto del proyecto antes de empezar a trabajar en cualquier paso.

---

## 📋 Prompt

```
Vamos a construir una app de finanzas personales en React Native con Expo.
Aquí está todo el contexto del proyecto para que lo tengas presente en toda la sesión.

---

## VISIÓN GENERAL

App personal de finanzas con un dashboard minimalista que muestra el estado financiero 
completo: gastos, deudas, ingresos, ahorros, inversiones y balance total.
Las transacciones se ingresan manualmente o llegan automáticamente desde un workflow de N8N 
que parsea correos bancarios. El usuario final no sabe nada de N8N ni de Gmail, 
eso es completamente invisible para él.

---

## STACK TECNOLÓGICO

- React Native + Expo (SDK 52+)
- Expo Router v4 (file-based routing)
- TypeScript (strict mode)
- Zustand (estado global)
- Supabase (Auth + PostgreSQL + Edge Functions)
- Victory Native o React Native Gifted Charts (gráficas)
- Expo Notifications (push notifications)
- React Native MMKV (storage local)

---

## ESTRUCTURA DE CARPETAS

finance-app/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (app)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             ← Dashboard
│   │   ├── transactions/
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── new.tsx
│   │   ├── reports.tsx
│   │   └── settings/
│   │       ├── index.tsx
│   │       ├── categories.tsx
│   │       └── notifications.tsx
│   └── _layout.tsx
├── src/
│   ├── components/
│   │   ├── ui/          ← Button, Card, Input, Badge, Toast, Modal, Skeleton, EmptyState
│   │   ├── dashboard/   ← SummaryCard, FinanceRow, QuickStats
│   │   ├── transactions/← TransactionItem, TransactionForm, FilterBar
│   │   └── charts/      ← DonutChart, BarChart
│   ├── store/           ← authStore, transactionStore, categoryStore
│   ├── services/        ← supabase, authService, transactionService, categoryService, dashboardService
│   ├── hooks/           ← useAuth, useDashboard, useTransactions, useReports, useNotifications
│   ├── types/           ← database.ts, app.ts
│   ├── utils/           ← formatCurrency, formatDate, calculateBalance
│   └── constants/       ← categories, colors, theme
├── supabase/
│   └── functions/
│       └── ingest-transaction/
│           └── index.ts

---

## MODELO DE DATOS (Supabase / PostgreSQL)

### Tablas principales:

profiles       → id (uuid, FK auth.users), full_name, currency (default 'MXN'), created_at
categories     → id, user_id, name, type, icon, color, is_default
transactions   → id, user_id, category_id, amount, type, description, date, is_recurring, 
                 recurrence, source ('manual'|'n8n_gmail'), external_id (unique), created_at
notification_settings → id, user_id, type, enabled, threshold
email_sync_log → id, user_id, gmail_message_id (unique), parsed_transaction_id, status, raw_subject

### Types permitidos en transactions.type:
'income' | 'expense' | 'saving' | 'investment' | 'debt'

### Vista dashboard_summary:
Agrupa transactions por user_id y mes, calculando totales por tipo y net_balance:
net_balance = income - expense - debt + saving + investment

### RLS activo en todas las tablas.
### Trigger handle_new_user: crea profile automáticamente al registrarse.

---

## PANTALLAS Y FLUJO

1. Auth Guard en app/_layout.tsx → redirige a /login si no hay sesión
2. Login / Register → Supabase Auth con email + password
3. Dashboard (Home) → SummaryCard con net_balance + FinanceRows por tipo + gráfica
4. Transacciones → Lista con filtros, FAB para nueva, swipe to delete
5. Nueva/Editar Transacción → Form con monto, tipo, categoría, fecha, nota
6. Reportes → Donut por categoría + Bar ingresos vs gastos, selector de mes
7. Settings → Perfil, categorías custom, notificaciones

---

## INTEGRACIÓN N8N (invisible para el usuario)

N8N parsea correos bancarios y llama a:
POST /functions/v1/ingest-transaction
Header: x-api-key: <secret>
Body: { user_id, transactions: [{ gmail_message_id, amount, type, description, date, category_id }] }

La Edge Function hace UPSERT con ON CONFLICT external_id para evitar duplicados.

---

## PRINCIPIOS DE CÓDIGO

- TypeScript strict, sin any
- Componentes funcionales con hooks
- Separación estricta: Screen → Hook → Store → Service → Supabase
- Manejo de errores en todos los servicios (try/catch con tipos)
- Loading states y empty states en todas las pantallas
- Diseño minimalista, colores consistentes desde constants/theme.ts
- Nunca lógica de negocio dentro de los componentes/pantallas

---

Teniendo este contexto, voy a pedirte que implementes partes específicas de la app.
Siempre sigue la estructura de carpetas establecida. Pregunta si algo no queda claro.
```

---

## ✅ Cuándo usar este prompt

- Al iniciar una sesión nueva en Cursor / Windsurf
- Cuando el editor "olvida" el contexto en conversaciones largas
- Antes de cualquiera de los prompts de paso (01 al 12)

---

*[[README Prompts|← Volver al índice de prompts]]*
