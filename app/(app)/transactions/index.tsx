import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function TransactionsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <AppHeader
                title="Transacciones"
                rightAction={<Button label="Nueva" size="sm" onPress={() => router.push('/transactions/new')} />}
            />
            <View style={styles.content}>
                <Text style={styles.text}>Transacciones</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { color: theme.colors.textMuted },
});
