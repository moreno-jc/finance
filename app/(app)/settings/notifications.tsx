import { AppHeader } from '@/components/ui/AppHeader';
import { theme } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export default function NotificationsScreen() {
    return (
        <View style={styles.container}>
            <AppHeader title="Notificaciones" />
            <View style={styles.content}>
                <Text style={styles.text}>Notificaciones (coming soon)</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { color: theme.colors.textMuted },
});
