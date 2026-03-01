---
tags:
  - prompt
  - graficas
  - reportes
  - charts
created: '2026-03-01'
step: 8
---
# 📈 Prompt 08 — Gráficas y Reportes

Tags: #prompt #graficas #reportes #charts #victory-native

---

## 📋 Prompt

```
Implementa la pantalla de reportes con gráficas interactivas de donut y barras.

## TAREA 1: Queries de reportes

Agrega a src/services/dashboardService.ts:

- getMonthlyReport(userId: string, month: string): Promise<MonthlyReport>
  → Query con GROUP BY category para gastos del mes
  → Retorna: resumen por categoría + totales + % de cada una

- getLast6MonthsSummary(userId: string): Promise<MonthlySummary[]>
  → SELECT de dashboard_summary de los últimos 6 meses
  → Para el bar chart comparativo

Tipos en types/app.ts:
MonthlyReport:
{
  month: string
  byCategory: { category: Category; amount: number; percentage: number }[]
  totalExpense: number
  totalIncome: number
  savingsRate: number  ← (income - expense) / income * 100
}

MonthlySummary:
{
  month: string          ← 'Ene', 'Feb', etc.
  total_income: number
  total_expense: number
  net_balance: number
}

## TAREA 2: useReports hook

Crea src/hooks/useReports.ts:
- selectedMonth: Date (estado local)
- Fetch de getMonthlyReport al montar y al cambiar mes
- Fetch de getLast6MonthsSummary al montar (no cambia con el selector de mes)
- Expone: monthlyReport, last6Months, isLoading, selectedMonth, setSelectedMonth

## TAREA 3: DonutChart component

Crea src/components/charts/DonutChart.tsx:

Usa react-native-gifted-charts (PieChart) o victory-native (VictoryPie)

Props:
- data: { value: number; color: string; label: string }[]
- centerLabel?: string  ← texto en el centro (ej: "Gastos")
- size?: number

Diseño:
- Donut con agujero central (innerRadius 60%)
- Centro: monto total en grande + label
- Al tocar un segmento: resaltar y mostrar detalle (nombre + % + monto)
- Animación de entrada (de 0 a valor final)
- Sin leyenda inline (la leyenda va en la lista de categorías abajo)

## TAREA 4: BarChart component

Crea src/components/charts/BarChart.tsx:

Props:
- data: MonthlySummary[]
- highlightMonth?: string

Diseño:
- Barras agrupadas: ingreso (verde) vs gasto (rojo) por mes
- Eje X: etiquetas de mes abreviado
- Eje Y: montos con formato abreviado ($10k, $50k)
- Mes actual resaltado
- Animación de entrada
- Scroll horizontal si hay más de 4 meses

## TAREA 5: Pantalla de Reportes

Crea app/(app)/reports.tsx:

Layout (ScrollView):

Sección 1 — Selector de mes:
- Flechas < Marzo 2026 > (igual que Dashboard)

Sección 2 — KPIs del mes (3 tarjetas horizontales):
| Ingresos | Gastos | Tasa ahorro |
| $15,000  | $8,500 | 43% ↑       |
- Cada KPI con color y flecha de tendencia vs mes anterior

Sección 3 — Distribución de Gastos:
- Título "¿En qué gasté?"
- DonutChart centrado
- Lista de categorías debajo del chart:
  [ícono+color] Nombre ............... $X,XXX (XX%)
  Ordenadas por monto desc

Sección 4 — Tendencia 6 meses:
- Título "Últimos 6 meses"
- BarChart con ingresos vs gastos

Sección 5 — Insights automáticos (textos dinámicos):
Generar 2-3 insights basados en los datos:
- "Gastaste 15% menos que el mes pasado en Comida 🎉"
- "Tu mayor gasto fue Renta (35% del total)"
- "Ahorraste $X,XXX este mes 💪"
Lógica basada en comparación mes anterior y distribución

## TAREA 6: Formateo de números para charts

Añade a src/utils/formatCurrency.ts:
- formatCompact(amount: number): string  → "$10k", "$1.5M"
- formatPercentage(value: number): string → "43.2%"

## OUTPUT ESPERADO:
- Donut chart interactivo mostrando distribución real de gastos por categoría
- Bar chart con últimos 6 meses de ingresos vs gastos
- KPIs del mes con comparativa vs mes anterior
- Insights automáticos generados dinámicamente
- Animaciones suaves en los gráficos
- Cambio de mes actualiza donut y KPIs (no el bar chart de 6 meses)
- Empty state si no hay transacciones para el mes seleccionado
```

---

## ✅ Verificación post-prompt

- [ ] Donut chart muestra gastos por categoría con colores correctos
- [ ] Tap en segmento del donut muestra detalle de esa categoría
- [ ] Bar chart muestra 6 meses con barras verdes (income) y rojas (expense)
- [ ] KPIs muestran tendencia vs mes anterior (↑↓)
- [ ] Insights generados correctamente con datos reales
- [ ] Cambio de mes actualiza los datos del donut y KPIs

**Siguiente:** [[Prompt 09 - Notificaciones]]

---

*[[README Prompts|← Índice de prompts]]*
