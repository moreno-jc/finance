import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';
import { useTransactionStore } from '@/store/transactionStore';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ComparisonItem {
    label: string;
    icon: string;
    color: string;
    amount: number;
}

export function ComparisonCards() {
    const { getCurrentMonthStats } = useTransactionStore();
    const stats = useMemo(() => getCurrentMonthStats(), [getCurrentMonthStats]);

    const items: ComparisonItem[] = [
        {
            label: 'Ingresos',
            icon: 'arrow-up-circle-outline',
            color: theme.colors.types.income,
            amount: stats.income,
        },
        {
            label: 'Gastos',
            icon: 'arrow-down-circle-outline',
            color: theme.colors.types.expense,
            amount: stats.expense,
        },
        {
            label: 'Deudas',
            icon: 'alert-circle-outline',
            color: theme.colors.types.debt,
            amount: stats.debt,
        },
    ];

    const formatAmount = (amount: number) => {
        return amount.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
        });
    };

    return (
        <View style={styles.container}>
            {items.map((item, index) => (
                <Card key={index} style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                            <Ionicons name={item.icon as any} size={28} color={item.color} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={[styles.amount, { color: item.color }]}>
                                {formatAmount(item.amount)}
                            </Text>
                        </View>
                    </View>
                </Card>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing[16],
        marginBottom: theme.spacing[20],
        gap: theme.spacing[12],
    },
    card: {
        flex: 1,
        padding: theme.spacing[12],
    },
    cardContent: {
        alignItems: 'center',
        gap: theme.spacing[12],
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
    },
    label: {
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing[4],
    },
    amount: {
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.bold,
    },
});
