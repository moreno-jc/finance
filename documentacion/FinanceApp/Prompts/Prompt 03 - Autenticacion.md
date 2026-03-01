---
tags:
  - prompt
  - auth
  - login
  - zustand
created: '2026-03-01'
step: 3
---
# 🔐 Prompt 03 — Autenticación

Tags: #prompt #auth #login #supabase #zustand

---

## 📋 Prompt

```
Implementa el sistema de autenticación completo de la finance app.

## TAREA 1: authService

Crea src/services/authService.ts con las siguientes funciones, todas con try/catch 
y retornando { data, error }:

- signUp(email: string, password: string, fullName: string)
  → Llama supabase.auth.signUp con metadata { full_name: fullName }

- signIn(email: string, password: string)
  → Llama supabase.auth.signInWithPassword

- signOut()
  → Llama supabase.auth.signOut

- getSession()
  → Llama supabase.auth.getSession

- onAuthStateChange(callback)
  → Retorna supabase.auth.onAuthStateChange(callback)
  → Retorna el subscription para poder cancelarlo

- getProfile(userId: string)
  → SELECT * FROM profiles WHERE id = userId, single()

## TAREA 2: authStore (Zustand)

Crea src/store/authStore.ts con:

Estado:
- user: User | null  (tipo de @supabase/supabase-js)
- profile: Profile | null  (tipo propio de types/app.ts)
- session: Session | null
- isLoading: boolean
- isInitialized: boolean  ← importante para el splash/guard

Acciones:
- setUser, setProfile, setSession, setLoading, setInitialized
- initialize() → llama getSession(), setea estado, suscribe a onAuthStateChange
- logout() → llama signOut(), limpia todo el estado

## TAREA 3: useAuth hook

Crea src/hooks/useAuth.ts con:
- Consume authStore
- Expone: user, profile, session, isLoading, isInitialized
- Funciones: login(email, password), register(email, password, fullName), logout
- Manejo de errores: retorna { error: string | null } en login y register
- Validación básica antes de llamar al servicio (campos no vacíos)

## TAREA 4: Pantalla Login

Crea app/(auth)/login.tsx:
- Campos: email (teclado email, autoCapitalize none) y password (secureTextEntry)
- Botón "Iniciar sesión" que llama a login del hook
- Link "¿No tienes cuenta? Regístrate" que navega a /register
- Loading state en el botón mientras autentica
- Mostrar error si login falla (debajo del botón, en rojo)
- Al autenticarse exitosamente, el auth guard redirige automáticamente (no manejar aquí)
- Diseño minimalista: logo o ícono arriba, campos centrados, sin distracciones

## TAREA 5: Pantalla Register

Crea app/(auth)/register.tsx:
- Campos: nombre completo, email, contraseña, confirmar contraseña
- Validación: contraseñas coinciden, email válido, campos no vacíos
- Usa react-hook-form + zod para validación
- Botón "Crear cuenta" con loading state
- Link "¿Ya tienes cuenta? Inicia sesión"
- Mostrar errores por campo (debajo de cada input)

## TAREA 6: Auth Guard en _layout.tsx

Crea app/_layout.tsx (root layout):
- Llama initialize() del authStore en useEffect una sola vez
- Mientras isInitialized === false → mostrar SplashScreen o ActivityIndicator centrado
- Si isInitialized === true y sin sesión → redirect a /(auth)/login
- Si isInitialized === true y con sesión → renderizar Slot (rutas protegidas)
- Suscribirse y limpiar la suscripción onAuthStateChange en el unmount

## TAREA 7: Layout de auth

Crea app/(auth)/_layout.tsx:
- Stack navigator simple sin header
- Si hay sesión activa → redirect a /(app)/ para evitar volver al login

## OUTPUT ESPERADO:
- Flujo completo: abrir app → detecta sesión → redirige correctamente
- Login y registro funcionales con Supabase
- Profile creado automáticamente via trigger al registrarse
- Estado de auth persistido entre cierres de la app (AsyncStorage)
- TypeScript sin errores en todos los archivos
```

---

## ✅ Verificación post-prompt

- [ ] Login con usuario existente funciona
- [ ] Registro crea usuario en `auth.users` Y en `profiles`
- [ ] Al cerrar y reabrir la app, la sesión persiste
- [ ] Sin sesión → redirige a login
- [ ] Con sesión → redirige al dashboard
- [ ] Errores de Supabase (email duplicado, contraseña corta) se muestran al usuario

**Siguiente:** [[Prompt 04 - Navegacion y Layout]]

---

*[[README Prompts|← Índice de prompts]]*
