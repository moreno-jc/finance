import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';
import { useTransactionStore } from '@/store/transactionStore';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function BalanceCard() {
    const { getMonthComparison } = useTransactionStore();
    const comparison = useMemo(() => getMonthComparison(), [getMonthComparison]);

    const isIncreased = comparison.percentageChange >= 0;
    const formattedBalance = comparison.currentMonth.balance.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
    });

    const formattedPercentage = Math.abs(comparison.percentageChange).toFixed(1);
    const comparisonText = isIncreased
        ? `↑ +${formattedPercentage}% vs mes anterior`
        : `↓ ${formattedPercentage}% vs mes anterior`;

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>Balance Total</Text>
                <Badge
                    text={comparisonText}
                    backgroundColor={isIncreased ? theme.colors.success : theme.colors.error}
                    textColor={theme.colors.white}
                />
            </View>
            <Text style={styles.balance}>{formattedBalance}</Text>
            <View style={styles.footer}>
                <View style={styles.iconGroup}>
                    <Ionicons
                        name={isIncreased ? 'trending-up' : 'trending-down'}
                        size={20}
                        color={isIncreased ? theme.colors.success : theme.colors.error}
                    />
                    <Text style={[styles.footerText, { color: isIncreased ? theme.colors.success : theme.colors.error }]}>
                        {comparisonText}
                    </Text>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: theme.spacing[16],
        marginBottom: theme.spacing[16],
        padding: theme.spacing[16],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing[12],
    },
    label: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.textMuted,
    },
    balance: {
        fontSize: theme.typography.sizes['3xl'],
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing[12],
    },
    footer: {
        marginTop: theme.spacing[12],
        paddingTop: theme.spacing[12],
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    iconGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[8],
    },
    footerText: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
    },
});
