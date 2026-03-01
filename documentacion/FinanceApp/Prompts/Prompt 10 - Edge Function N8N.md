---
tags:
  - prompt
  - edge-function
  - n8n
  - backend
  - supabase
created: '2026-03-01'
step: 10
---
# ⚡ Prompt 10 — Edge Function N8N

Tags: #prompt #edge-function #n8n #supabase #backend

---

## 📋 Prompt

```
Implementa la Edge Function de Supabase para recibir transacciones desde N8N.
Esta integración es invisible para el usuario final de la app.

## CONTEXTO
N8N parsea correos bancarios y los envía a este endpoint.
La app solo consume los datos que ya están en Supabase, 
sin saber ni importarle de dónde vinieron.

## TAREA 1: Edge Function principal

Crea supabase/functions/ingest-transaction/index.ts:

La función debe:

1. CORS: Manejar preflight OPTIONS request (N8N puede enviarlo)
   Responder con headers apropiados para permitir POST desde cualquier origen

2. Autenticación: Validar header x-api-key contra variable de entorno INGEST_API_KEY
   Si no coincide → 401 Unauthorized
   Si falta el header → 401

3. Parseo del body:
   Esperado:
   {
     user_id: string (UUID)
     transactions: Array<{
       gmail_message_id: string   ← ID único del correo en Gmail
       amount: number             ← siempre positivo
       type: 'income'|'expense'|'saving'|'investment'|'debt'
       description: string
       date: string               ← 'YYYY-MM-DD'
       category_id?: string       ← UUID opcional
     }>
   }

4. Validación del body:
   - user_id requerido y formato UUID válido
   - transactions array no vacío (máximo 50 por request)
   - Cada transacción: amount > 0, type válido, date formato correcto
   Si validación falla → 400 con mensaje descriptivo del campo que falló

5. Verificar que el user_id existe en profiles:
   Si no existe → 404 "User not found"

6. UPSERT de transacciones:
   INSERT INTO transactions (...) ON CONFLICT (external_id) DO NOTHING
   
   Mapeo de campos:
   - external_id ← gmail_message_id
   - source ← 'n8n_gmail'
   - category_id ← null si no se proporciona o no existe
   - Todos los demás campos directos

7. Log en email_sync_log:
   Por cada transacción insertada o skipped:
   INSERT INTO email_sync_log (user_id, gmail_message_id, parsed_transaction_id, status)
   status: 'success' si insertada, 'skipped' si duplicado

8. Respuesta exitosa:
   {
     ok: true,
     received: number,    ← total enviadas
     inserted: number,    ← nuevas
     skipped: number,     ← duplicadas
     failed: number       ← con error (si alguna falla individualmente)
   }

9. Manejo de errores:
   - Try/catch global → 500 con mensaje genérico (no exponer detalles internos)
   - Log de errores para debugging (console.error)

Usar el cliente de Supabase con SERVICE_ROLE_KEY (no anon key) para saltarse RLS.

## TAREA 2: Variables de entorno

Las variables necesarias en Supabase (configurar en Dashboard → Settings → Edge Functions):
- SUPABASE_URL (ya existe automáticamente)
- SUPABASE_SERVICE_ROLE_KEY (ya existe automáticamente)
- INGEST_API_KEY ← agregar manualmente, generar un UUID v4 como secret

Documenta cómo generarlo:
node -e "console.log(require('crypto').randomUUID())"

## TAREA 3: Script de deploy

Crea un archivo deploy.sh o documenta los comandos:
supabase login
supabase link --project-ref <project-ref>
supabase secrets set INGEST_API_KEY=<tu-key>
supabase functions deploy ingest-transaction --no-verify-jwt

## TAREA 4: Colección de pruebas

Crea un archivo supabase/functions/ingest-transaction/test.http
(formato compatible con REST Client de VS Code):

### Test 1: Payload válido con 1 transacción
POST https://<project>.supabase.co/functions/v1/ingest-transaction
x-api-key: {{INGEST_API_KEY}}
Content-Type: application/json

{
  "user_id": "{{TEST_USER_ID}}",
  "transactions": [{
    "gmail_message_id": "test_msg_001",
    "amount": 450.00,
    "type": "expense",
    "description": "Starbucks - prueba",
    "date": "2026-03-01"
  }]
}

### Test 2: Duplicado (mismo gmail_message_id)
(mismo body que Test 1 → debe retornar skipped: 1, inserted: 0)

### Test 3: API Key inválida → debe retornar 401

### Test 4: user_id inválido → debe retornar 404

### Test 5: amount negativo → debe retornar 400

### Test 6: Batch de 3 transacciones simultáneas

## TAREA 5: Documentación del contrato para N8N

Crea supabase/functions/ingest-transaction/CONTRACT.md con:
- URL del endpoint
- Headers requeridos
- Schema del body con ejemplos
- Posibles respuestas y sus significados
- Ejemplos de cURL
- Instrucciones de configuración en N8N (HTTP Request Node)

## OUTPUT ESPERADO:
- Edge Function desplegada y respondiendo en la URL de Supabase
- Test 1 retorna { ok: true, inserted: 1, skipped: 0 }
- Test 2 retorna { ok: true, inserted: 0, skipped: 1 } (deduplicación funciona)
- Tests de error retornan los status codes correctos
- Logs visibles en Supabase Dashboard → Edge Functions → Logs
- La transacción de Test 1 aparece en la app automáticamente
```

---

## ✅ Verificación post-prompt

- [ ] `supabase functions deploy ingest-transaction` sin errores
- [ ] Test 1 (happy path) retorna 200 con inserted: 1
- [ ] Test 2 (duplicado) retorna 200 con skipped: 1 (no error, solo omite)
- [ ] API Key incorrecta retorna 401
- [ ] La transacción insertada aparece en la lista de la app
- [ ] Email sync log registra la operación
- [ ] Logs en Supabase Dashboard muestran la ejecución

**Siguiente:** [[Prompt 11 - UI Polish y Componentes]]

---

*[[README Prompts|← Índice de prompts]]*
