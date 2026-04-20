import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'finance-app',
    slug: 'finance-app',
    scheme: 'financeapp',
    ios: {
        ...config.ios,
        bundleIdentifier: 'com.tuapp.financeapp',
    },
    android: {
        ...config.android,
        package: 'com.tuapp.financeapp',
    },
    plugins: [
        'expo-router',
        'expo-notifications',
        '@react-native-community/datetimepicker',
        ...(config.plugins?.filter((p: any) => typeof p === 'string' ? p !== 'expo-router' : p[0] !== 'expo-router') || [])
    ],
    extra: {
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
});
