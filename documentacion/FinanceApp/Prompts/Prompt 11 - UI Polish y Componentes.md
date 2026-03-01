---
tags:
  - prompt
  - ui
  - ux
  - componentes
  - design-system
created: '2026-03-01'
step: 11
---
# ✨ Prompt 11 — UI Polish y Componentes Base

Tags: #prompt #ui #ux #componentes #design-system

---

## 📋 Prompt

```
Implementa y pule todos los componentes base del design system de la finance app.
El objetivo es una UI minimalista, consistente y profesional.

## TAREA 1: Button component

Crea src/components/ui/Button.tsx

Props:
- label: string
- onPress: () => void
- variant: 'primary' | 'secondary' | 'ghost' | 'danger'
- size: 'sm' | 'md' | 'lg' (default: 'md')
- isLoading?: boolean
- disabled?: boolean
- leftIcon?: React.ReactNode
- fullWidth?: boolean

Estilos:
- primary: fondo #6366f1, texto blanco, hover con opacidad
- secondary: borde #6366f1, texto #6366f1, fondo transparente
- ghost: sin borde, texto #6b7280
- danger: fondo #ef4444, texto blanco
- Deshabilitado: opacidad 0.5
- Loading: reemplaza label con ActivityIndicator del color del texto
- Animación de press: scale 0.97 con Animated o Pressable con opacity

## TAREA 2: Input component

Crea src/components/ui/Input.tsx

Props:
- label?: string
- placeholder?: string
- value, onChangeText
- error?: string
- helperText?: string
- leftIcon?: React.ReactNode
- rightIcon?: React.ReactNode
- secureTextEntry?: boolean
- keyboardType, autoCapitalize, autoComplete
- multiline?: boolean, numberOfLines?
- disabled?: boolean

Estilos:
- Label arriba del input (gris oscuro, 14px)
- Border: 1px solid #e5e7eb, focus: #6366f1 (2px)
- Fondo: #f9fafb, focus: blanco
- Error: borde rojo, mensaje de error debajo en rojo 12px
- Helper text: gris, 12px, debajo del input
- Border radius: 8px
- Padding: 12px horizontal, 14px vertical
- Animación suave en el borde al hacer focus

## TAREA 3: Card component

Crea src/components/ui/Card.tsx

Props:
- children
- padding?: number (default 16)
- onPress?: () => void (si se da, se vuelve Pressable)
- style?: ViewStyle
- shadow?: 'none' | 'sm' | 'md' (default 'sm')

Estilos:
- Fondo blanco, border radius 12
- Shadow sm: shadowOpacity 0.05, shadowRadius 8, elevation 2
- Shadow md: shadowOpacity 0.10, shadowRadius 16, elevation 4
- Si onPress: feedback visual al presionar (opacity 0.8)

## TAREA 4: Badge component

Crea src/components/ui/Badge.tsx

Props:
- label: string
- type?: TransactionType (usa colores del theme por tipo)
- color?: string (override manual)
- size?: 'sm' | 'md'

Estilos:
- Fondo con opacidad 15% del color del tipo
- Texto con el color del tipo, 11px, font-weight 600
- Border radius full (pill shape)
- Padding: 3px 8px (sm) o 4px 10px (md)

## TAREA 5: EmptyState component

Crea src/components/ui/EmptyState.tsx

Props:
- icon: string (nombre de Ionicons)
- title: string
- description?: string
- actionLabel?: string
- onAction?: () => void

Estilos:
- Centrado vertical y horizontal
- Ícono grande (64px) en gris claro (#d1d5db)
- Título en gris oscuro, 16px, font-weight 600
- Descripción en gris, 14px, centrado
- Botón opcional (variant secondary)
- Padding generoso

Ejemplos de uso:
- Sin transacciones: ícono 'receipt-outline', "Sin transacciones", "Agrega tu primera transacción"
- Sin resultados de filtro: ícono 'search-outline', "Sin resultados"

## TAREA 6: ConfirmModal component

Crea src/components/ui/ConfirmModal.tsx

Props:
- visible: boolean
- title: string
- message: string
- confirmLabel?: string (default: "Confirmar")
- cancelLabel?: string (default: "Cancelar")
- onConfirm: () => void
- onCancel: () => void
- isDanger?: boolean (botón confirm en rojo si true)
- isLoading?: boolean

Implementación:
- Modal de React Native con animationType="fade"
- Overlay semitransparente oscuro
- Card centrada con bordes redondeados
- Título bold, mensaje en gris
- Dos botones: cancelar (ghost) y confirmar (primary o danger)
- Bloquear confirm button si isLoading

## TAREA 7: Mejoras de UX globales

### Pull-to-refresh consistente:
Crear un hook useRefresh(fetchFn) que maneje el estado de refresh:
- refreshing: boolean
- onRefresh: () => Promise<void>

### Keyboard Avoiding:
En todas las pantallas con formularios, usar KeyboardAvoidingView correctamente:
- behavior: 'padding' en iOS, 'height' en Android

### Safe Area:
Verificar que todas las pantallas usen SafeAreaView o el inset apropiado de useSafeAreaInsets()

### Loading states consistentes:
Cada pantalla debe tener su propio skeleton específico (no spinner genérico)
Los skeletons deben tener el mismo layout que el contenido real

### Feedback háptico:
Usar expo-haptics en:
- Tap en botones primarios: Haptics.impactAsync(ImpactFeedbackStyle.Light)
- Confirmación exitosa: Haptics.notificationAsync(NotificationFeedbackType.Success)
- Error: Haptics.notificationAsync(NotificationFeedbackType.Error)
- Long press / swipe delete: Haptics.impactAsync(ImpactFeedbackStyle.Medium)

## TAREA 8: Pantalla de Settings (perfil)

Completa app/(app)/settings/index.tsx:

Secciones:
1. Avatar + Nombre + Email del usuario
2. Moneda preferida (selector: MXN, USD, EUR)
3. Links a subcategorías: Categorías → y Notificaciones →
4. Sección "Cuenta": botón Cerrar sesión (rojo, con confirmación)
5. Footer: versión de la app

## OUTPUT ESPERADO:
- Todos los componentes base funcionando y tipados
- Design system consistente en toda la app
- Feedback háptico en acciones importantes
- Keyboard avoiding en formularios funciona en ambas plataformas
- Pantalla de settings completa con logout funcional
```

---

## ✅ Verificación post-prompt

- [ ] Button con todos sus variants y loading state
- [ ] Input con error state y focus animado
- [ ] Card con sombra y versión pressable
- [ ] Badge con colores por tipo de transacción
- [ ] EmptyState visible en lista sin transacciones
- [ ] ConfirmModal aparece antes de eliminar
- [ ] Feedback háptico al crear transacciones
- [ ] Settings muestra perfil y logout funciona

**Siguiente:** [[Prompt 12 - QA y Deploy]]

---

*[[README Prompts|← Índice de prompts]]*
