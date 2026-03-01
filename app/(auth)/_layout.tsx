import { useAuthStore } from '@/store/authStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
    const { session } = useAuthStore();

    // Redirigir si ya hay sesión activa
    if (session) {
        return <Redirect href="/(app)" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    );
}
