---
tags:
  - prompt
  - transacciones
  - crud
  - formulario
created: '2026-03-01'
step: 6
---
# 💸 Prompt 06 — Transacciones CRUD

Tags: #prompt #transacciones #crud #formulario #lista

---

## 📋 Prompt

```
Implementa el CRUD completo de transacciones: lista, nueva, editar y eliminar.

## TAREA 1: transactionService

Crea src/services/transactionService.ts con:

- getAll(userId: string, filters?: TransactionFilters): Promise<Transaction[]>
  Filters: { type?, categoryId?, month?, search? }
  → SELECT con JOIN a categories, ORDER BY date DESC
  → Aplicar filtros dinámicamente si se proporcionan

- getById(id: string): Promise<Transaction | null>

- create(data: CreateTransactionInput): Promise<Transaction>
  CreateTransactionInput: { user_id, amount, type, category_id?, description?, date, 
                             is_recurring?, recurrence?, source? }

- update(id: string, data: UpdateTransactionInput): Promise<Transaction>

- delete(id: string): Promise<void>

Tipo Transaction completo (en types/app.ts), incluye el join con category:
{
  id, user_id, category_id, amount, type, description, date,
  is_recurring, recurrence, source, external_id, created_at,
  category?: { id, name, icon, color, type }
}

## TAREA 2: Actualizar transactionStore

Añade al store:
Estado:
- transactions: Transaction[]
- filters: TransactionFilters
- isLoading: boolean
- selectedTransaction: Transaction | null

Acciones:
- fetchTransactions(userId: string)
- addTransaction(tx: Transaction) → optimistic update
- updateTransaction(id: string, data: Partial<Transaction>)
- removeTransaction(id: string) → optimistic update
- setFilters(filters: Partial<TransactionFilters>)
- setSelectedTransaction

## TAREA 3: useTransactions hook

Crea src/hooks/useTransactions.ts:
- Fetch automático al montar
- Re-fetch cuando cambian los filters del store
- Expone: transactions, isLoading, filters
- Funciones: 
  - createTransaction(data) → llama service + addTransaction al store
  - updateTransaction(id, data) → actualización optimista
  - deleteTransaction(id) → eliminación optimista con rollback en error
  - setFilter(key, value)
  - clearFilters()

## TAREA 4: Componentes de Transacciones

### TransactionItem.tsx (src/components/transactions/)
Props: transaction: Transaction, onPress?, onDelete?

- Ícono de la categoría (color de la categoría)
- Descripción o nombre de categoría si no hay descripción
- Fecha formateada (ej: "Hoy", "Ayer", "01 Mar")
- Monto con signo: verde + para income/saving/investment, rojo - para expense/debt
- Badge con el tipo (pequeño, color del tipo)
- Swipe to delete (usar react-native-gesture-handler o Pressable con confirmación)

### FilterBar.tsx (src/components/transactions/)
- Chips horizontales scrolleables para filtrar por tipo:
  Todos | Ingresos | Gastos | Ahorros | Inversiones | Deudas
- Selector de mes (igual que en Dashboard)
- Botón limpiar filtros (solo visible cuando hay filtros activos)
- Estilo: chips con borde, chip activo con fondo del color del tipo

## TAREA 5: Pantalla Lista de Transacciones

Crea app/(app)/transactions/index.tsx:

Layout:
- Header con título "Transacciones" y total del mes
- FilterBar debajo del header
- FlatList de TransactionItems agrupados por fecha
  (sección "Hoy", "Ayer", "Esta semana", fechas anteriores)
- FAB (Floating Action Button) con ícono + en la esquina inferior derecha
  → navega a /transactions/new
- Pull-to-refresh
- Empty state si no hay transacciones (con el filtro activo)
- Loading skeleton (lista de 6 TransactionItem placeholders)

Agrupación por fecha:
Crear util formatDateGroup(date: string): string que retorna 'Hoy', 'Ayer', o fecha formateada

## TAREA 6: Pantalla Nueva / Editar Transacción

Crea app/(app)/transactions/new.tsx y app/(app)/transactions/[id].tsx
Ambas usan el mismo componente TransactionForm.

### TransactionForm.tsx (src/components/transactions/)
Props: initialValues?, onSubmit, isLoading, mode: 'create' | 'edit'

Campos del formulario (react-hook-form + zod):

1. Tipo selector (fila de 5 botones icon+label, uno seleccionado a la vez):
   💰 Ingreso | 💸 Gasto | 🏦 Ahorro | 📈 Inversión | 💳 Deuda

2. Monto (Input grande, teclado numérico decimal):
   - Prefix con símbolo de moneda ($)
   - Tamaño de fuente grande (32px)
   - Placeholder: "0.00"

3. Categoría (selector en modal/bottom sheet):
   - Filtra automáticamente por el tipo seleccionado
   - Muestra ícono + nombre de categoría
   - Default: primera categoría del tipo seleccionado

4. Descripción (Input opcional, texto libre)

5. Fecha (DatePicker nativo):
   - Default: hoy
   - No permite fechas futuras

6. Recurrente (Toggle switch):
   - Si activo → mostrar selector de frecuencia: Diario/Semanal/Mensual/Anual

Validación Zod:
- amount: z.number().positive().max(9999999)
- type: z.enum(['income','expense','saving','investment','debt'])
- date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
- description: z.string().max(200).optional()

Botón submit: "Guardar transacción" / "Actualizar" con loading state

### app/(app)/transactions/new.tsx:
- Header con botón X para cerrar y título "Nueva transacción"
- Renderiza TransactionForm en mode='create'
- Al guardar exitosamente: cerrar modal + invalidar cache del dashboard

### app/(app)/transactions/[id].tsx:
- Carga la transacción por ID desde el store o hace fetch
- Header con botón eliminar (ícono trash) en el lado derecho
- Renderiza TransactionForm en mode='edit' con los valores iniciales
- Botón eliminar: muestra ConfirmModal antes de borrar
- Al eliminar: navega back + invalida cache

## OUTPUT ESPERADO:
- Lista de transacciones con datos reales
- Filtros funcionales (tipo y mes)
- Crear nueva transacción y verla inmediatamente en la lista
- Editar transacción existente
- Eliminar con confirmación
- Dashboard se actualiza al crear/editar/eliminar (invalidar fetchDashboard)
```

---

## ✅ Verificación post-prompt

- [ ] Lista muestra transacciones reales agrupadas por fecha
- [ ] Filtros por tipo funcionan
- [ ] FAB abre formulario de nueva transacción
- [ ] Al crear transacción aparece inmediatamente en la lista
- [ ] Editar actualiza los valores correctamente
- [ ] Eliminar pide confirmación y desaparece de la lista
- [ ] Dashboard refleja los cambios al volver a él

**Siguiente:** [[Prompt 07 - Categorias]]

---

*[[README Prompts|← Índice de prompts]]*
