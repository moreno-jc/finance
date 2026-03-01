import { AppHeader } from '@/components/ui/AppHeader';
import { theme } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function EditTransactionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View style={styles.container}>
            <AppHeader title="Editar Transacción" />
            <View style={styles.content}>
                <Text style={styles.text}>Editar Transacción {id} (coming soon)</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { color: theme.colors.textMuted },
});
