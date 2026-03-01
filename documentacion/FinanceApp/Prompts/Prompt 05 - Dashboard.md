---
tags:
  - prompt
  - dashboard
  - ui
  - zustand
created: '2026-03-01'
step: 5
---
# 📊 Prompt 05 — Dashboard

Tags: #prompt #dashboard #ui #zustand #supabase

---

## 📋 Prompt

```
Implementa la pantalla de Dashboard, el corazón de la finance app.

## TAREA 1: dashboardService

Crea src/services/dashboardService.ts:

- getSummary(userId: string, month: string): Promise<DashboardSummary | null>
  → SELECT * FROM dashboard_summary WHERE user_id = ? AND month = ?
  → month formato: 'YYYY-MM-01' (primer día del mes)
  → Retorna DashboardSummary o null si no hay datos

- getRecentTransactions(userId: string, limit = 5): Promise<Transaction[]>
  → SELECT con join a categories, ORDER BY date DESC, LIMIT limit

Tipo DashboardSummary (en types/app.ts):
{
  user_id: string
  month: string
  total_income: number
  total_expense: number
  total_saving: number
  total_investment: number
  total_debt: number
  net_balance: number
}

## TAREA 2: transactionStore + dashboardSlice

Actualiza o crea src/store/transactionStore.ts con:

Estado:
- summary: DashboardSummary | null
- recentTransactions: Transaction[]
- selectedMonth: Date  ← mes actualmente visualizado
- isLoadingSummary: boolean

Acciones:
- setSummary, setRecentTransactions, setSelectedMonth, setLoadingSummary
- fetchDashboard(userId: string, month: Date) → llama al service y actualiza el estado

## TAREA 3: useDashboard hook

Crea src/hooks/useDashboard.ts:
- Obtiene userId del authStore
- Al montar: llama fetchDashboard con el mes actual
- Al cambiar selectedMonth: re-fetch automático
- Expone: summary, recentTransactions, isLoading, selectedMonth, setSelectedMonth
- Función: refresh() para pull-to-refresh manual

## TAREA 4: Componentes del Dashboard

### SummaryCard.tsx (src/components/dashboard/)
Tarjeta principal con el balance total:
- Balance neto grande y centrado (ej: "$12,450.00")
- Indicador visual: verde si positivo, rojo si negativo, con flecha ↑↓
- Subtítulo: "Balance de [Mes Año]"
- Fondo con gradiente suave (primary color)
- Texto en blanco
- Bordes redondeados, sombra sutil

### FinanceRow.tsx (src/components/dashboard/)
Fila para cada categoría financiera:
Props: type: TransactionType, amount: number, currency: string

- Ícono del tipo (color según theme por tipo)
- Label del tipo en español: Ingresos / Gastos / Ahorros / Inversiones / Deudas
- Monto formateado alineado a la derecha
- Color del monto según tipo (verde para income/saving, rojo para expense/debt, azul para investment)
- Separador sutil entre filas

### QuickStats.tsx (src/components/dashboard/)
Mini sección de transacciones recientes:
- Título "Recientes"
- Hasta 5 TransactionItem compactos
- Link/botón "Ver todas" que navega a /transactions
- Si no hay transacciones: EmptyState pequeño

## TAREA 5: Pantalla Dashboard

Crea app/(app)/index.tsx:

Layout (ScrollView vertical):
1. Header: "Hola, [nombre]! 👋" + selector de mes (flechas < Marzo 2026 >)
2. SummaryCard con net_balance
3. Sección "Resumen" con 5 FinanceRows (income, expense, saving, investment, debt)
4. Separador
5. QuickStats (transacciones recientes)

Comportamiento:
- Pull-to-refresh con RefreshControl
- Loading skeleton mientras carga (mostrar placeholders grises animados)
- Si no hay datos del mes → empty state con mensaje amigable
- El selector de mes no puede ir más allá del mes actual (futuro bloqueado)
- Al cambiar mes → re-fetch automático via useDashboard

Formateo de moneda:
- Usar Intl.NumberFormat con currency del perfil (default MXN)
- Crear util en src/utils/formatCurrency.ts:
  formatCurrency(amount: number, currency = 'MXN'): string

## TAREA 6: Skeleton de carga

Crea src/components/ui/LoadingSkeleton.tsx:
- Componente genérico con props: width, height, borderRadius
- Animación de shimmer (de izquierda a derecha) con Animated API
- Color base: #f3f4f6, shimmer: #e5e7eb

Crea DashboardSkeleton que muestre el layout del dashboard mientras carga.

## OUTPUT ESPERADO:
- Dashboard muestra datos reales desde Supabase
- Cambio de mes refetch los datos correctamente  
- Pull-to-refresh funciona
- Skeleton visible durante la carga
- Montos formateados correctamente en MXN
- Si el usuario no tiene transacciones: mensaje de bienvenida con CTA para agregar la primera
```

---

## ✅ Verificación post-prompt

- [ ] Dashboard carga y muestra datos reales
- [ ] SummaryCard muestra net_balance en verde/rojo según signo
- [ ] Los 5 FinanceRows muestran los totales por tipo
- [ ] Selector de mes cambia los datos al navegar
- [ ] Pull-to-refresh actualiza los datos
- [ ] Skeleton visible ~1-2 segundos antes de los datos
- [ ] Nombre del usuario en el saludo

**Siguiente:** [[Prompt 06 - Transacciones CRUD]]

---

*[[README Prompts|← Índice de prompts]]*
