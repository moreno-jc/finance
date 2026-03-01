---
tags:
  - prompt
  - setup
  - expo
  - typescript
created: '2026-03-01'
step: 1
---
# ⚙️ Prompt 01 — Setup y Configuración

Tags: #prompt #setup #expo #typescript #dependencias

---

## 📋 Prompt

```
Inicializa el proyecto de la finance app con la siguiente configuración exacta.

## TAREA: Setup inicial del proyecto

### 1. Crear el proyecto
Usa este comando como base:
npx create-expo-app finance-app --template expo-template-blank-typescript

### 2. Instala TODAS estas dependencias:

# Navegación
npx expo install expo-router react-native-safe-area-context react-native-screens 
  expo-linking expo-constants expo-status-bar

# Supabase
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
npm install react-native-mmkv

# Estado
npm install zustand

# UI / Gráficas
npm install react-native-gifted-charts react-native-linear-gradient
npx expo install expo-haptics

# Notificaciones
npx expo install expo-notifications expo-device

# Forms y validación
npm install react-hook-form zod @hookform/resolvers

# Fechas
npm install date-fns

# Icons
npx expo install @expo/vector-icons

### 3. Configura app.json / app.config.ts

Crea app.config.ts con:
- scheme: "financeapp"
- plugins: ["expo-router", "expo-notifications"]
- ios.bundleIdentifier: "com.tuapp.financeapp"
- android.package: "com.tuapp.financeapp"
- Variables de entorno desde process.env para SUPABASE_URL y SUPABASE_ANON_KEY

### 4. Configura tsconfig.json

Agrega paths aliases:
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@store/*": ["src/store/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@constants/*": ["src/constants/*"],
      "@types/*": ["src/types/*"]
    }
  }
}

### 5. Crea el archivo .env en la raíz:
EXPO_PUBLIC_SUPABASE_URL=tu_url_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

### 6. Crea la estructura de carpetas completa (vacía con archivos index.ts o .gitkeep):
- src/components/ui/
- src/components/dashboard/
- src/components/transactions/
- src/components/charts/
- src/store/
- src/services/
- src/hooks/
- src/types/
- src/utils/
- src/constants/
- supabase/functions/ingest-transaction/

### 7. Crea src/constants/theme.ts con:
- Colores primarios: primary (#6366f1), secondary (#8b5cf6)
- Colores por tipo: income (#10b981), expense (#ef4444), saving (#6366f1), 
  investment (#0ea5e9), debt (#f59e0b)
- Tipografía base
- Spacing scale (4, 8, 12, 16, 24, 32)
- Border radius (4, 8, 12, 16, 24, full)

### 8. Crea src/constants/categories.ts con las 12 categorías predefinidas
(nombre, tipo, icono de @expo/vector-icons, color hex)

### 9. Crea src/types/app.ts con los tipos:
- TransactionType = 'income' | 'expense' | 'saving' | 'investment' | 'debt'
- Transaction, Category, Profile, DashboardSummary, NotificationSetting
- Todos los tipos con campos opcionales correctamente marcados

### 10. Configura babel.config.js para que funcionen los path aliases con babel-plugin-module-resolver

### OUTPUT ESPERADO:
- Proyecto corriendo con npx expo start sin errores
- Estructura de carpetas lista
- TypeScript compilando sin errores
- Variables de entorno accesibles
```

---

## ✅ Verificación post-prompt

Asegúrate de que el editor genere:
- [ ] `app.config.ts` con variables de entorno
- [ ] `tsconfig.json` con path aliases
- [ ] `.env` (sin commitearlo)
- [ ] `.gitignore` con `.env`
- [ ] `src/constants/theme.ts` con la paleta completa
- [ ] `src/types/app.ts` con todos los tipos

**Siguiente:** [[Prompt 02 - Supabase y Base de Datos]]

---

*[[README Prompts|← Índice de prompts]]*
