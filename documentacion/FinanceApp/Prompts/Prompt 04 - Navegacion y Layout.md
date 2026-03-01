---
tags:
  - prompt
  - navegacion
  - expo-router
  - tabs
created: '2026-03-01'
step: 4
---
# 🗺️ Prompt 04 — Navegación y Layout

Tags: #prompt #navegacion #expo-router #tabs #layout

---

## 📋 Prompt

```
Implementa la navegación completa de la finance app usando Expo Router v4.

## TAREA 1: Tab Navigator principal

Crea app/(app)/_layout.tsx con:
- Bottom tab navigator con 4 tabs:
  1. Dashboard (index) → ícono 'home' de Ionicons
  2. Transacciones → ícono 'list' de Ionicons  
  3. Reportes → ícono 'bar-chart' de Ionicons
  4. Configuración → ícono 'settings' de Ionicons
- Estilo de tabs:
  - backgroundColor del tab bar: blanco (#ffffff)
  - Color activo: primary del theme (#6366f1)
  - Color inactivo: gris (#9ca3af)
  - Borde superior sutil: 1px solid #f3f4f6
  - Sin label en los tabs (solo íconos) O labels cortos
  - Tab bar height: 60px con safe area padding
- Ocultar header en todas las tabs (headerShown: false en cada Screen)

## TAREA 2: Stack de Transacciones

Las rutas de transactions necesitan un Stack interno:
- transactions/index.tsx → lista (sin header propio, el tab lo maneja)
- transactions/new.tsx → modal o pantalla con header "Nueva transacción" y botón X
- transactions/[id].tsx → pantalla con header "Editar transacción" y botón back

Crea app/(app)/transactions/_layout.tsx como Stack:
- new.tsx → presentación como modal en iOS, push en Android
- [id].tsx → push con back button

## TAREA 3: Stack de Settings

Crea app/(app)/settings/_layout.tsx como Stack:
- index.tsx → "Configuración" (sin back)
- categories.tsx → "Categorías" con back
- notifications.tsx → "Notificaciones" con back

## TAREA 4: Componente TabBar personalizado (opcional pero recomendado)

Crea src/components/ui/TabBar.tsx:
- Bottom tab bar custom con animación suave al cambiar de tab
- Íconos con pequeña animación de escala al seleccionar
- Usar Animated API de React Native
- Soporte para safe area (insets.bottom)

## TAREA 5: Pantallas placeholder

Crea pantallas vacías (solo un View con texto centrado) para todas las rutas 
que aún no implementamos, para que la navegación funcione sin errores:
- app/(app)/index.tsx → "Dashboard (coming soon)"
- app/(app)/transactions/index.tsx → "Transacciones"
- app/(app)/transactions/new.tsx → "Nueva Transacción"
- app/(app)/transactions/[id].tsx → "Editar Transacción"
- app/(app)/reports.tsx → "Reportes"
- app/(app)/settings/index.tsx → "Configuración"
- app/(app)/settings/categories.tsx → "Categorías"
- app/(app)/settings/notifications.tsx → "Notificaciones"

## TAREA 6: Header compartido

Crea src/components/ui/AppHeader.tsx:
- Props: title, subtitle (opcional), rightAction (componente opcional)
- Estilo consistente: título en negro, subtítulo en gris
- Soporte para safe area top

## OUTPUT ESPERADO:
- Navegar entre las 4 tabs sin errores
- Abrir pantalla de nueva transacción desde tab de transacciones
- Back navigation funcionando en stacks internos
- Sin warnings de navegación en consola
- TypeScript correcto (tipos de Expo Router para useRouter, useLocalSearchParams, etc.)

## NOTAS IMPORTANTES:
- Usar useRouter() de expo-router para navegación programática
- Para pasar params: router.push('/transactions/new?mode=income')
- Para acceder a params: useLocalSearchParams<{ id: string }>()
- Los layouts de Expo Router usan <Slot /> o <Stack /> o <Tabs />, no children
```

---

## ✅ Verificación post-prompt

- [ ] Las 4 tabs son navegables y muestran su ícono correcto
- [ ] Tab activa visualmente diferenciada
- [ ] Navegar a `/transactions/new` abre la pantalla correcta
- [ ] Back button en stacks funciona
- [ ] Safe area respetada en iPhone con notch y en Android
- [ ] Sin errores en consola de navegación

**Siguiente:** [[Prompt 05 - Dashboard]]

---

*[[README Prompts|← Índice de prompts]]*
