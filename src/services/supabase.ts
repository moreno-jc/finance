import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Variables de entorno cargadas con expo-constants en app.config.ts
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string;

// Fallback por si la app env cachea mal process.env
const url = supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const key = supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!url || !key) {
    console.warn('⚠️ Faltan variables de entorno para Supabase (EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY). Asegúrate de tener el archivo .env configurado.');
}

// Lazy initialization - evita que Supabase intente inicializarse durante el bundling
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // ← IMPORTANTE en React Native
      },
    });
  }
  return supabaseInstance;
};

// Export backwards compatible
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    return getSupabaseClient()[prop as keyof SupabaseClient];
  },
});