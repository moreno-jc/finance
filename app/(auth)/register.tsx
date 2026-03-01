import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    const { register, isLoading, error: authError } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        setLocalError(null);

        if (password !== confirmPassword) {
            setLocalError('Las contraseñas no coinciden');
            return;
        }

        await register(email, password, fullName);
    };

    const currentError = localError || authError;

    return (
        <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Crea tu cuenta</Text>
                        <Text style={styles.subtitle}>Comienza a tomar el control hoy</Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Nombre completo"
                            placeholder="Juan Pérez"
                            autoCapitalize="words"
                            value={fullName}
                            onChangeText={setFullName}
                            disabled={isLoading}
                        />

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
                            value={password}
                            onChangeText={setPassword}
                            disabled={isLoading}
                        />

                        <Input
                            label="Confirmar contraseña"
                            placeholder="••••••••"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            disabled={isLoading}
                            error={currentError || undefined}
                        />

                        <Button
                            label="Crear Cuenta"
                            onPress={handleRegister}
                            isLoading={isLoading}
                            style={styles.registerButton}
                        />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                        <TouchableOpacity onPress={() => router.replace('/login')} disabled={isLoading}>
                            <Text style={styles.link}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: theme.spacing[24],
        justifyContent: 'center',
    },
    header: {
        marginBottom: theme.spacing[32],
        marginTop: theme.spacing[32],
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
    },
    form: {
        width: '100%',
    },
    registerButton: {
        marginTop: theme.spacing[16],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing[32],
        marginBottom: theme.spacing[32],
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
