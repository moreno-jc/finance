---
tags:
  - prompt
  - notificaciones
  - push
  - expo-notifications
  - toast
created: '2026-03-01'
step: 9
---
# 🔔 Prompt 09 — Notificaciones

Tags: #prompt #notificaciones #push #expo-notifications

---

## 📋 Prompt

```
Implementa el sistema de notificaciones push de la finance app.

## CONTEXTO
Hay 3 tipos de notificaciones para el MVP:
1. Recordatorio semanal → "¿Ya registraste tus gastos de la semana?" (lunes 9am)
2. Alerta de gastos → cuando gastos > X% de ingresos del mes (configurable)
3. Confirmación in-app → Toast al guardar una transacción (NO es push, es local)

## TAREA 1: Setup de Expo Notifications

En app/_layout.tsx, al inicializar la app:
- Solicitar permisos de notificaciones con expo-notifications
- Si permisos denegados: no insistir, guardar estado en AsyncStorage
- Registrar el token de push (para futuro uso con servidor)
- Configurar el handler de notificaciones:
  shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false

## TAREA 2: notificationService

Crea src/services/notificationService.ts:

- requestPermissions(): Promise<boolean>
  → Pide permisos, retorna si fueron concedidos

- scheduleWeeklyReminder(enabled: boolean): Promise<void>
  → Si enabled: programar notificación semanal cada lunes a las 9am
     Usar Notifications.scheduleNotificationAsync con trigger tipo 'weekly'
  → Si !enabled: cancelar la notificación programada (buscar por identifier)
  → identifier: 'weekly-reminder'

- checkExpenseAlert(userId: string, threshold: number): Promise<void>
  → Consultar el dashboard_summary del mes actual
  → Si total_expense / total_income * 100 > threshold:
     Enviar notificación local inmediata con el porcentaje actual
  → identifier: 'expense-alert'

- cancelNotification(identifier: string): Promise<void>

- getAllScheduled(): Promise<Notification[]>
  → Para debug y verificación

- saveSettings(userId: string, settings: NotificationPreferences): Promise<void>
  → Guarda en tabla notification_settings de Supabase

- loadSettings(userId: string): Promise<NotificationPreferences>

Tipo NotificationPreferences:
{
  weeklyReminder: boolean
  expenseAlert: boolean
  expenseThreshold: number  ← porcentaje, default 80
}

## TAREA 3: useNotifications hook

Crea src/hooks/useNotifications.ts:
- Carga settings desde Supabase al montar
- Al cambiar weeklyReminder → llama scheduleWeeklyReminder
- Al cambiar expenseAlert o threshold → re-evalúa checkExpenseAlert
- Expone: preferences, isLoading, updatePreference(key, value)

## TAREA 4: Componente Toast (in-app)

Crea src/components/ui/Toast.tsx:

Props: message, type: 'success' | 'error' | 'info', duration = 3000

- Aparece en la parte superior de la pantalla (debajo del safe area top)
- Animación: slide down + fade in al mostrar, slide up + fade out al ocultar
- Colores: success (#10b981), error (#ef4444), info (#6366f1)
- Ícono a la izquierda (checkmark, X, info)
- Auto-dismiss después de `duration` ms
- Se puede descartar manualmente con swipe up

Crear un hook useToast():
- showToast(message, type) → muestra el toast
- Manejar una cola si se disparan múltiples toasts seguidos

Registrar el Toast en el root layout para que sea accesible globalmente.

## TAREA 5: Pantalla de Configuración de Notificaciones

Crea app/(app)/settings/notifications.tsx:

Layout:
Título: "Notificaciones"

Sección 1 — Recordatorio semanal:
[Toggle] Recordatorio semanal
Descripción: "Recibe un recordatorio cada lunes para registrar tus gastos"
(Si está activo → muestra "Programado para los lunes a las 9:00 AM")

Sección 2 — Alerta de gastos:
[Toggle] Alerta de overspending
Descripción: "Notificación cuando tus gastos superen el límite"
Si toggle activo → mostrar slider:
  "Alertar cuando los gastos superen el [80]% de tus ingresos"
  Slider de 50% a 100% con paso de 5%
  Label del valor actual grande y centrado

Sección 3 — Estado (solo debug en dev):
Si __DEV__: botón "Probar notificación ahora" que dispara una notificación de prueba

Nota al pie:
"Las notificaciones se envían solo en tu dispositivo, no se almacenan en nuestros servidores."

## TAREA 6: Integración con el resto de la app

- En transactionService.create(): después de guardar → llamar showToast('Transacción guardada ✓', 'success')
- En transactionService.delete(): → showToast('Transacción eliminada', 'info')
- En authService.signOut(): → cancelar todas las notificaciones programadas
- En app/_layout.tsx: al inicializar, si hay sesión → checkExpenseAlert con el threshold guardado

## OUTPUT ESPERADO:
- Permisos de notificaciones solicitados correctamente al primer uso
- Recordatorio semanal se programa/cancela con el toggle
- Alerta de gastos se dispara si se supera el threshold
- Toast aparece al crear/eliminar transacciones
- Configuración persiste en Supabase entre sesiones
```

---

## ✅ Verificación post-prompt

- [ ] Permisos solicitados en el primer arranque
- [ ] Toggle de recordatorio semanal programa/cancela la notificación
- [ ] Slider de threshold funciona y guarda el valor
- [ ] Toast verde aparece al guardar una transacción
- [ ] Toast se auto-descarta después de 3 segundos
- [ ] Settings persisten al cerrar y reabrir la app

**Siguiente:** [[Prompt 10 - Edge Function N8N]]

---

*[[README Prompts|← Índice de prompts]]*
