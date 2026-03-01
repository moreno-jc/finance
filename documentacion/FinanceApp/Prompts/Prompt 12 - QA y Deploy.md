---
tags:
  - prompt
  - qa
  - deploy
  - eas
  - build
  - testing
created: '2026-03-01'
step: 12
---
# 🚀 Prompt 12 — QA y Deploy

Tags: #prompt #qa #deploy #eas #testing #build

---

## 📋 Prompt

```
Prepara la finance app para su primer build de producción. 
Revisa errores, optimiza y genera el build con EAS.

## TAREA 1: Revisión de TypeScript

Ejecuta y corrige TODOS los errores de TypeScript:
npx tsc --noEmit

Checklist de tipos a verificar:
- Todos los servicios retornan tipos explícitos (no any)
- Los hooks exponen tipos correctos
- Los props de componentes están tipados con interfaces
- Los params de rutas de Expo Router usan useLocalSearchParams<T>()
- El cliente de Supabase usa el tipo Database genérico

## TAREA 2: Revisión de manejo de errores

Verifica que CADA servicio tenga try/catch y que:
- Los errores de red muestren mensaje amigable al usuario (Toast)
- Los errores de autenticación redirigen al login
- Los errores de Supabase no expongan detalles técnicos al usuario
- No haya console.log en producción (usar __DEV__ guard)

Crea src/utils/errorHandler.ts:
- parseSupabaseError(error: PostgrestError): string
  → Traduce códigos de error a mensajes amigables en español:
  '23505' (unique violation) → "Este registro ya existe"
  '23503' (foreign key) → "No se puede eliminar, está en uso"
  'PGRST116' (not found) → "No se encontró el registro"
  Default → "Ocurrió un error inesperado"

## TAREA 3: Optimizaciones de performance

### Memo y callbacks:
- Envolver en React.memo los componentes de lista: TransactionItem, FinanceRow, CategoryItem
- Usar useCallback en handlers que se pasan como props
- Usar useMemo en cálculos derivados del store

### FlatList optimizations:
En todas las FlatLists:
- keyExtractor={item => item.id}
- removeClippedSubviews={true}
- maxToRenderPerBatch={10}
- initialNumToRender={8}
- windowSize={5}
- getItemLayout si los items tienen altura fija

### Imágenes y assets:
- Verificar que los assets estén optimizados
- Usar expo-image en lugar de Image de RN si hay imágenes de red

## TAREA 4: Configuración de EAS Build

Instala EAS CLI: npm install -g eas-cli

Crea eas.json:
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "...",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "..."
      }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "ios": { "simulator": false }
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": {}
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "...", "ascAppId": "..." },
      "android": { "serviceAccountKeyPath": "..." }
    }
  }
}

Comandos de build:
# Development (para testing con Expo Go no funciona, necesita dev client)
eas build --profile development --platform all

# Preview (APK para Android, IPA sin firma para iOS)
eas build --profile preview --platform android

# Producción
eas build --profile production --platform all

## TAREA 5: Checklist de QA manual

Genera un script de prueba manual que cubra:

### Flujo de autenticación:
[ ] Registrar nuevo usuario → perfil creado en Supabase
[ ] Login con usuario existente → redirige al dashboard
[ ] Cerrar sesión → redirige al login
[ ] Reabrir app con sesión activa → va directo al dashboard
[ ] Login con credenciales incorrectas → muestra error

### Dashboard:
[ ] Muestra balance correcto (verificar vs suma manual en Supabase)
[ ] Cambiar mes hacia atrás → datos del mes anterior
[ ] Pull-to-refresh → datos actualizados
[ ] Sin transacciones → empty state con mensaje y CTA

### Transacciones:
[ ] Crear transacción de cada tipo → aparece en lista y dashboard
[ ] Editar transacción → cambios reflejados inmediatamente
[ ] Eliminar transacción → desaparece de lista, dashboard actualizado
[ ] Filtrar por tipo → solo muestra ese tipo
[ ] Toast aparece al crear/eliminar

### Categorías:
[ ] Categorías del sistema no editables/eliminables
[ ] Crear categoría custom → disponible en formulario de transacciones
[ ] Editar categoría → cambios reflejados
[ ] Eliminar categoría con transacciones → error descriptivo

### Reportes:
[ ] Donut muestra distribución correcta de gastos
[ ] Bar chart muestra últimos 6 meses
[ ] Cambiar mes → donut y KPIs actualizados

### Notificaciones:
[ ] Permiso solicitado en primer uso
[ ] Toggle recordatorio semanal → programado/cancelado
[ ] Threshold de gasto persiste al reiniciar la app

### Edge Function:
[ ] POST con payload válido → transacción aparece en la app
[ ] POST con gmail_message_id duplicado → no duplica
[ ] POST sin API key → 401

### General:
[ ] Funciona en iPhone (iOS 16+) y Android (API 31+)
[ ] Sin crashes en flujos normales
[ ] Performance: dashboard carga < 2 segundos
[ ] Modo avión → mensajes de error sin crash
[ ] Teclado no cubre inputs en formularios

## TAREA 6: Variables de entorno para producción

Lista todas las variables que se deben configurar antes del build de producción:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY
- (En Supabase Secrets): INGEST_API_KEY

Asegúrate de que ninguna clave sensible esté hardcodeada en el código.
Busca en todo el proyecto: grep -r "eyJ" --include="*.ts" (JWTs hardcodeados)

## TAREA 7: app.config.ts final

Verifica y completa app.config.ts:
- name: "Finance App"
- slug: "finance-app"
- version: "1.0.0"
- orientation: "portrait" (bloquear landscape)
- icon y splash screen configurados
- permissions de iOS: NSCameraUsageDescription (si se usa para avatar)
- permissions de Android: POST_NOTIFICATIONS
- updates: { fallbackToCacheTimeout: 0 }

## OUTPUT ESPERADO:
- 0 errores de TypeScript
- Build de preview generado exitosamente
- QA checklist completo sin fallos críticos
- La app instalable en dispositivo físico o simulador
- Edge Function respondiendo en producción

## COMANDOS FINALES:
npx tsc --noEmit          # 0 errores
eas build --profile preview --platform android   # APK de prueba
eas build --profile preview --platform ios       # IPA de prueba (requiere cuenta Apple)
```

---

## ✅ Verificación final del MVP

- [ ] TypeScript: 0 errores con `tsc --noEmit`
- [ ] EAS Build completa sin errores
- [ ] APK/IPA instalable en dispositivo real
- [ ] Todos los flujos del checklist de QA pasados
- [ ] Edge Function funcionando en producción
- [ ] N8N workflow enviando datos al endpoint correctamente
- [ ] Sin claves hardcodeadas en el código
- [ ] README del proyecto actualizado con instrucciones de setup

---

## 🎉 ¡MVP Completo!

Al terminar este paso tienes un MVP funcional con:
- Auth completa con Supabase
- Dashboard con datos reales
- CRUD de transacciones
- Categorías custom
- Reportes con gráficas
- Notificaciones push
- Integración N8N (endpoint listo)
- Build de producción

**Post-MVP → ver [[../Roadmap|Roadmap v1.1+]]**

---

*[[README Prompts|← Índice de prompts]] | [[../README|← Documentación principal]]*
