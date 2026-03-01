import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        await login(email, password);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="wallet" size={48} color={theme.colors.primary} />
                </View>
                <Text style={styles.title}>Bienvenido de nuevo</Text>
                <Text style={styles.subtitle}>Inicia sesión para gestionar tus finanzas</Text>
            </View>

            <View style={styles.form}>
                <Input
                    label="Email"
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                    disabled={isLoading}
                />

                <Input
                    label="Contraseña"
                    placeholder="••••••••"
                    secureTextEntry
                    autoComplete="password"
                    value={password}
                    onChangeText={setPassword}
                    disabled={isLoading}
                    error={error || undefined}
                />

                <Button
                    label="Iniciar Sesión"
                    onPress={handleLogin}
                    isLoading={isLoading}
                    style={styles.loginButton}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/register')} disabled={isLoading}>
                    <Text style={styles.link}>Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing[24],
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing[40],
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing[16],
    },
    title: {
        fontSize: theme.typography.sizes['2xl'],
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing[8],
    },
    subtitle: {
        fontSize: theme.typography.sizes.base,
        color: theme.colors.textMuted,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    loginButton: {
        marginTop: theme.spacing[8],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing[32],
    },
    footerText: {
        color: theme.colors.textMuted,
        fontSize: theme.typography.sizes.sm,
    },
    link: {
        color: theme.colors.primary,
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
    },
});
