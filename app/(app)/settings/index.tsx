import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
    const router = useRouter();
    const { logout, profile, session } = useAuth();

    return (
        <View style={styles.container}>
            <AppHeader title="Configuración" />
            <ScrollView contentContainerStyle={styles.content}>
                <Card style={styles.section}>
                    <Text style={styles.title}>Perfil</Text>
                    <Text style={styles.text}>{profile?.full_name || 'Usuario'}</Text>
                    <Text style={styles.textMuted}>{session?.user?.email}</Text>
                </Card>

                <View style={styles.links}>
                    <Button label="Categorías" variant="ghost" onPress={() => router.push('/settings/categories')} />
                    <Button label="Notificaciones" variant="ghost" onPress={() => router.push('/settings/notifications')} />
                </View>

                <View style={styles.logout}>
                    <Button label="Cerrar Sesión" variant="danger" onPress={logout} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.surface },
    content: { padding: theme.spacing[16], flexGrow: 1 },
    section: { marginBottom: theme.spacing[16] },
    title: { fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.semibold, marginBottom: theme.spacing[8], color: theme.colors.text },
    text: { color: theme.colors.text, fontSize: theme.typography.sizes.base, fontWeight: theme.typography.weights.medium },
    textMuted: { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm, marginTop: 2 },
    links: { gap: theme.spacing[8], marginBottom: theme.spacing[24] },
    logout: { marginTop: 'auto' },
});
