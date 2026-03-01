---
tags:
  - prompt
  - supabase
  - postgresql
  - sql
  - rls
created: '2026-03-01'
step: 2
---
# 🗄️ Prompt 02 — Supabase y Base de Datos

Tags: #prompt #supabase #postgresql #sql #rls

---

## 📋 Prompt

```
Configura Supabase y crea todo el schema de base de datos para la finance app.

## TAREA 1: Cliente Supabase

Crea src/services/supabase.ts con:
- Cliente Supabase usando EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY
- Storage adapter usando AsyncStorage (compatible con React Native)
- autoRefreshToken: true, persistSession: true, detectSessionInUrl: false
- Exporta el cliente como `supabase` (named export)

## TAREA 2: SQL — Ejecutar en Supabase SQL Editor

Genera el SQL completo y listo para copiar/pegar en el SQL Editor de Supabase:

### Tabla profiles (extiende auth.users):
- id: uuid, FK a auth.users, CASCADE delete, PRIMARY KEY
- full_name: text
- avatar_url: text  
- currency: text, default 'MXN'
- created_at: timestamptz, default now()

### Trigger automático:
Función handle_new_user() que hace INSERT en profiles cuando se crea un auth.user.
Usa raw_user_meta_data->>'full_name' para el nombre.

### Tabla categories:
- id: uuid, gen_random_uuid(), PK
- user_id: uuid, FK profiles, CASCADE (nullable para categorías default del sistema)
- name, type (check: income/expense/saving/investment/debt), icon, color
- is_default: boolean, default false
- created_at: timestamptz

### Tabla transactions:
- id: uuid PK
- user_id: uuid, FK profiles, CASCADE
- category_id: uuid, FK categories, SET NULL on delete
- amount: numeric(12,2) NOT NULL
- type: text, check (income/expense/saving/investment/debt)
- description: text
- date: date, default current_date
- is_recurring: boolean, default false
- recurrence: text, check (daily/weekly/monthly/yearly), nullable
- source: text, default 'manual'
- external_id: text, UNIQUE (para deduplicación N8N)
- created_at: timestamptz

### Índices de transactions:
- idx_transactions_user en (user_id)
- idx_transactions_date en (date DESC)
- idx_transactions_type en (type)

### Tabla notification_settings:
- id, user_id (FK), type (check: weekly_reminder/expense_alert/transaction_confirm)
- enabled: boolean default true
- threshold: numeric(5,2) nullable
- UNIQUE(user_id, type)

### Tabla email_sync_log:
- id, user_id (FK), gmail_message_id (UNIQUE)
- parsed_transaction_id: uuid FK transactions SET NULL
- status: text check (success/failed/skipped)
- raw_subject: text
- created_at

### RLS — habilitar y crear policies en TODAS las tablas:
Política para cada tabla: "Users manage own data"
ON ALL USING (auth.uid() = user_id)
Para profiles: USING (auth.uid() = id)

### Vista dashboard_summary:
SELECT user_id, date_trunc('month', date) as month,
totales por cada tipo con COALESCE y FILTER WHERE type = '...',
net_balance = income - expense - debt + saving + investment
GROUP BY user_id, date_trunc('month', date)

### Seed de categorías predefinidas (is_default = true, user_id = null):
Income: Salario (#10b981), Freelance (#34d399), Inversiones (#6ee7b7)
Expense: Comida (#f59e0b), Transporte (#fbbf24), Renta (#f97316), 
         Entretenimiento (#fb923c), Salud (#ef4444)
Saving: Fondo emergencia (#6366f1), Vacaciones (#8b5cf6)
Investment: Bolsa/ETFs (#0ea5e9)
Debt: Tarjeta crédito (#ec4899)

## TAREA 3: Tipos TypeScript desde Supabase

Crea src/types/database.ts con los tipos que corresponden al schema:
- Database (tipo raíz para el cliente Supabase con genéricos)
- Tipos por tabla: Tables<'profiles'>, Tables<'transactions'>, etc.
- Tipos de Insert y Update para cada tabla
- Tipo de la vista: DashboardSummaryRow

## TAREA 4: Actualizar el cliente Supabase

Actualiza src/services/supabase.ts para usar el tipo Database:
createClient<Database>(url, key, options)

## OUTPUT ESPERADO:
- src/services/supabase.ts funcional
- SQL completo listo para ejecutar en Supabase (en un solo bloque copiable)
- src/types/database.ts con todos los tipos del schema
- El cliente tiene autocompletado completo de tablas y columnas
```

---

## ✅ Verificación post-prompt

- [ ] `supabase.ts` importa y exporta el cliente correctamente
- [ ] SQL ejecutado sin errores en Supabase
- [ ] RLS activado (verificar en Supabase Dashboard → Authentication → Policies)
- [ ] Vista `dashboard_summary` creada y consultable
- [ ] Seed ejecutado: 12 categorías en tabla categories
- [ ] `database.ts` con tipos que coinciden con el schema real

**Siguiente:** [[Prompt 03 - Autenticacion]]

---

*[[README Prompts|← Índice de prompts]]*
