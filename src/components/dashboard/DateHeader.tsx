import { theme } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export function DateHeader() {
    const now = new Date();
    const monthName = now.toLocaleString('es-ES', { month: 'long' });
    const year = now.getFullYear();
    const formattedDate = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}, ${year}`;

    return (
        <View style={styles.container}>
            <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing[16],
        paddingVertical: theme.spacing[16],
    },
    dateText: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
    },
});
