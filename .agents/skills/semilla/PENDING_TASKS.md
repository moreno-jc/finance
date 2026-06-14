# Pending Tasks & Mejoras

> Checklist vivo. Marcar con ✅ al completar. Agregar nuevas tareas detectadas al final de cada sección.

---

## 🔴 Crítico (bloqueante para MVP)

- [ ] `dashboardService.ts` — implementar `getSummary(userId, month)` conectado a vista `dashboard_summary`
- [ ] `useDashboard.ts` — hook para cargar datos reales en el Dashboard
- [ ] Conectar `BalanceCard`, `ComparisonCards`, `RecentTransactions` con datos reales de Supabase
- [ ] `categoryService.ts` — CRUD completo de categorías
- [ ] `categoryStore.ts` — estado global de categorías
- [ ] Edge Function `supabase/functions/ingest-transaction/index.ts` — crear, validar API key, UPSERT
- [ ] Revisar `transactionService.ts` — confirmar que `getAll`, `create`, `update`, `delete` funcionan

---

## 🟡 Importante (UX crítica)

- [ ] `useNotifications.ts` — solicitar permisos + configurar recordatorio semanal + alerta de gastos
- [ ] Pantalla `reports.tsx` — implementar con DonutChart + BarChart + selector de mes
- [ ] Paginación o infinite scroll en lista de transacciones
- [ ] Loading skeleton en Dashboard y lista de transacciones
- [ ] Pull-to-refresh en Dashboard
- [ ] Toast in-app al guardar/eliminar transacción
- [ ] Cobertura completa de i18n (todos los strings hardcoded → i18n keys)

---

## 🟢 Mejoras recomendadas

- [ ] `useTransactions.ts` — hook dedicado (actualmente la lógica está dispersa)
- [ ] `useReports.ts` — hook para pantalla de reportes
- [ ] `Toast.tsx` — componente de toast in-app (no existe aún)
- [ ] `LoadingSkeleton.tsx` — componente reutilizable (no existe aún)
- [ ] Error handling consistente en todos los services (try/catch → toast de error)
- [ ] RLS verificado en todas las tablas (profiles, categories, transactions, notification_settings)
- [ ] Seed de categorías predefinidas ejecutado en Supabase
- [ ] Trigger `handle_new_user` en Supabase para crear perfil automáticamente
- [ ] Configurar `eas.json` para builds de desarrollo y producción

---

## 📋 Post-MVP (backlog)

- [ ] Metas de ahorro con progreso
- [ ] Modo oscuro
- [ ] Exportar a CSV
- [ ] Múltiples monedas
- [ ] Presupuesto mensual por categoría
- [ ] Sincronización bancaria directa (Open Banking)
- [ ] IA para clasificación automática de transacciones

---

## ✅ Completado

- [x] Setup Expo + TypeScript
- [x] Configuración de Supabase client (`src/services/supabase.ts`)
- [x] Tipos DB (`src/types/database.ts`)
- [x] Auth completo (login, register, signOut, guard en `_layout.tsx`)
- [x] `authStore.ts` + `useAuth.ts`
- [x] Navegación por tabs (Dashboard, Transacciones, Reportes, Settings)
- [x] Estructura de pantallas de transacciones (index, new, [id])
- [x] `TransactionForm.tsx` con validación Zod
- [x] `SearchBar.tsx` integrada en TransactionForm
- [x] Componentes UI base: Button, Card, Input, Badge, EmptyState, ConfirmModal, TabBar
- [x] Componentes Dashboard: BalanceCard, ComparisonCards, DateHeader, RecentTransactions
- [x] i18next + expo-localization instalado
- [x] react-native-gifted-charts instalado
- [x] Skill `semilla` creada (2026-06-13)
