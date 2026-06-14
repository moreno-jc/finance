# Checklist MVP — Finance App IA

## Setup y Base

- [ ] Inicializar Expo con TypeScript: `npx create-expo-app finance-app --template`
- [ ] Configurar path aliases en `tsconfig.json`
- [ ] Instalar dependencias: `expo-router`, `zustand`, `@supabase/supabase-js`, `react-native-mmkv`, `expo-auth-session`, `expo-notifications`, `victory-native`
- [ ] Configurar variables de entorno (`.env` + `app.config.ts`)
- [ ] Setup ESLint + Prettier

### Supabase

- [ ] Crear proyecto en Supabase
- [ ] Habilitar Google como proveedor OAuth en Supabase Auth
- [ ] Ejecutar SQL: tablas `profiles`, `categories`, `transactions`, `notification_settings`
- [ ] Configurar RLS en todas las tablas
- [ ] Crear vista `dashboard_summary`
- [ ] Crear trigger `handle_new_user`
- [ ] Seed de categorías predefinidas
- [ ] Generar types de TypeScript: `supabase gen types`

### Arquitectura base

- [ ] `src/services/supabase.ts` (cliente)
- [ ] `src/types/database.ts` + `src/types/app.ts`
- [ ] `src/constants/categories.ts`, `colors.ts`, `theme.ts`

---

## Autenticación (Google OAuth)

- [ ] Configurar Google Cloud Console: OAuth Client ID para iOS y Android
- [ ] Pantalla `(auth)/login.tsx` con botón "Continuar con Google"
- [ ] `src/services/authService.ts`
  - [ ] `signInWithGoogle()` usando `expo-auth-session` + `supabase.auth.signInWithIdToken`
  - [ ] `signOut()`
  - [ ] `getSession()`
  - [ ] Guardar `google_provider_token` en `profiles` post-login
- [ ] `src/store/authStore.ts`
- [ ] Auth guard en `app/_layout.tsx`
- [ ] Redirect automático post-login al Dashboard
- [ ] Redirect automático post-logout a Login

---

## Dashboard

- [ ] Pantalla `(app)/index.tsx`
- [ ] `src/services/dashboardService.ts` → `getSummary(userId, month)`
- [ ] `src/hooks/useDashboard.ts`
- [ ] `SummaryCard.tsx` (balance total + indicador)
- [ ] `FinanceRow.tsx` (icono + label + monto por categoría)
- [ ] `QuickStats.tsx` (mini resumen)
- [ ] Selector de mes en el header
- [ ] Botón "Sincronizar Gmail" con loading state
- [ ] Loading skeleton, empty state, pull-to-refresh

---

## Transacciones

- [ ] `src/services/transactionService.ts`: `getAll`, `getById`, `create`, `update`, `delete`
- [ ] `src/store/transactionStore.ts` + `src/hooks/useTransactions.ts`
- [ ] Pantalla lista `(app)/transactions/index.tsx`
  - [ ] `TransactionItem.tsx`
  - [ ] `FilterBar.tsx` (tipo, mes, categoría)
  - [ ] Paginación / infinite scroll
  - [ ] FAB para nueva transacción
- [ ] Pantalla `new.tsx` + `[id].tsx` con `TransactionForm.tsx`
  - [ ] Campo monto (teclado numérico)
  - [ ] Selector tipo + categoría (filtrado por tipo)
  - [ ] Date picker
  - [ ] Campo descripción, toggle recurrente
  - [ ] Validación + confirmación para eliminar

---

## Integración Gmail

- [ ] Edge Function `supabase/functions/sync-gmail/index.ts`
  - [ ] Leer `google_provider_token` desde `profiles`
  - [ ] Llamar Gmail API con filtros por remitente bancario
  - [ ] Parsear monto, tipo, fecha, descripción (regex por banco)
  - [ ] UPSERT `ON CONFLICT (gmail_message_id) DO NOTHING`
  - [ ] Respuesta `{ ok, inserted, skipped }`
- [ ] Deploy: `supabase functions deploy sync-gmail`
- [ ] Test con curl / Postman
- [ ] Manejo de token expirado (solicitar re-autenticación)
- [ ] Bancos configurados: BBVA, Citibanamex, HSBC, Santander, Banorte

---

## Reportes

- [ ] Pantalla `(app)/reports.tsx`
- [ ] `src/hooks/useReports.ts`
- [ ] `DonutChart.tsx` (gastos por categoría)
- [ ] `BarChart.tsx` (ingresos vs gastos por mes)
- [ ] Selector de mes + comparativa vs mes anterior
- [ ] Tabla resumen por categoría con %

---

## Configuración

- [ ] `(app)/settings/index.tsx` — perfil + logout
- [ ] `(app)/settings/categories.tsx` — listar, crear, editar, eliminar categorías custom
- [ ] `(app)/settings/notifications.tsx` — toggles + slider threshold
- [ ] `src/services/categoryService.ts` + `src/store/categoryStore.ts`

---

## Notificaciones

- [ ] `src/hooks/useNotifications.ts`
- [ ] Solicitar permisos en onboarding
- [ ] Notificación semanal (lunes 9am)
- [ ] Alerta: gastos > umbral % de ingresos
- [ ] Toast in-app al guardar transacción
- [ ] Config guardada en `notification_settings`

---

## UI / Componentes Base

- [ ] `Button.tsx` (primary, secondary, ghost, danger)
- [ ] `Card.tsx`, `Input.tsx`, `Badge.tsx`
- [ ] `LoadingSkeleton.tsx`, `EmptyState.tsx`
- [ ] `Toast.tsx`, `ConfirmModal.tsx`

---

## Deploy & QA

- [ ] `eas.json` configurado
- [ ] Build desarrollo: `eas build --profile development`
- [ ] Build producción: `eas build --profile production`
- [ ] TestFlight (iOS) / APK interno (Android)
- [ ] Flujo completo: login Google → dashboard → nueva tx → sync Gmail → reporte
- [ ] Verificar deduplicación de transacciones Gmail
- [ ] Probar en iOS y Android
- [ ] Verificar RLS (sin filtración entre usuarios)
- [ ] Performance: carga del dashboard < 1.5s

---

## Progreso por módulo

| Módulo | Tareas | Completadas | % |
|---|---|---|---|
| Setup | 13 | 0 | 0% |
| Auth Google | 9 | 0 | 0% |
| Dashboard | 9 | 0 | 0% |
| Transacciones | 16 | 0 | 0% |
| Gmail Sync | 10 | 0 | 0% |
| Reportes | 6 | 0 | 0% |
| Configuración | 7 | 0 | 0% |
| Notificaciones | 6 | 0 | 0% |
| UI Components | 8 | 0 | 0% |
| Deploy + QA | 10 | 0 | 0% |
| **Total** | **94** | **0** | **0%** |
