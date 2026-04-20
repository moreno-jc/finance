import { Card } from '@/components/ui/Card';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { theme } from '@/constants/theme';
import { useTransactionStore } from '@/store/transactionStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function RecentTransactions() {
    const { getRecentTransactions, categories } = useTransactionStore();
    const router = useRouter();
    const recentTransactions = useMemo(() => getRecentTransactions(10), [getRecentTransactions]);

    const formatAmount = (amount: number, type: string) => {
        const sign = type === 'income' ? '+' : '-';
        return `${sign}$${amount.toLocaleString('es-MX', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
    };

    const getTypeColor = (type: string) => {
        return theme.colors.types[type as keyof typeof theme.colors.types] || theme.colors.primary;
    };

    const renderTransaction = ({ item }: any) => {
        const category = categories.find(c => c.id === item.category_id);
        const color = getTypeColor(item.type);

        return (
            <TouchableOpacity
                style={styles.transactionItem}
                onPress={() => router.push(`/(app)/transactions/${item.id}`)}
            >
                <View style={styles.leftContent}>
                    <View style={[styles.iconWrapper, { backgroundColor: `${color}20` }]}>
                        <CategoryIcon name={category?.icon || 'wallet'} color={color} size={20} />
                    </View>
                    <View style={styles.textContent}>
                        <Text style={styles.categoryName}>{category?.name || 'Sin categoría'}</Text>
                        <Text style={styles.description}>{item.description || 'Sin descripción'}</Text>
                        <Text style={styles.date}>{formatDate(item.date)}</Text>
                    </View>
                </View>
                <View style={styles.rightContent}>
                    <Text style={[styles.amount, { color }]}>
                        {formatAmount(Number(item.amount), item.type)}
                    </Text>
                    <Ionicons
                        name={item.type === 'income' ? 'arrow-up' : 'arrow-down'}
                        size={16}
                        color={color}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    if (recentTransactions.length === 0) {
        return null;
    }

    return (
        <Card style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Transacciones Recientes</Text>
                <TouchableOpacity onPress={() => router.push('/(app)/transactions')}>
                    <Text style={styles.viewAll}>Ver todas</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={recentTransactions}
                renderItem={renderTransaction}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: theme.spacing[16],
        marginBottom: theme.spacing[20],
        padding: theme.spacing[16],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing[16],
    },
    title: {
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
    },
    viewAll: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.primary,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing[12],
    },
    leftContent: {
        flex: 1,
        flexDirection: 'row',
        gap: theme.spacing[12],
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContent: {
        flex: 1,
    },
    categoryName: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing[2],
    },
    description: {
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing[2],
    },
    date: {
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.textLight,
    },
    rightContent: {
        alignItems: 'flex-end',
        gap: theme.spacing[4],
    },
    amount: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.bold,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
    },
});
