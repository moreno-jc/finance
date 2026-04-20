import { TransactionForm } from '@/components/transactions/TransactionForm';
import { AppHeader } from '@/components/ui/AppHeader';
import { theme } from '@/constants/theme';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NewTransactionScreen() {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <AppHeader title="Nueva Transacción" showBackButton />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <TransactionForm />
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    keyboardView: { flex: 1 },
});
