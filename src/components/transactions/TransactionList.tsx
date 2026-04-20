import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { theme } from '@/constants/theme';
import { useTransactionStore } from '@/store/transactionStore';
import { GroupedTransactions } from '@/types/filters';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TransactionListProps {
    grouped: GroupedTransactions[];
    onTransactionDeleted?: () => void;
}

export function TransactionList({ grouped, onTransactionDeleted }: TransactionListProps) {
    const { deleteTransaction, categories } = useTransactionStore();
    const router = useRouter();
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [showActionMenu, setShowActionMenu] = useState(false);

    const formatAmount = (amount: number, type: string) => {
        const sign = type === 'income' ? '+' : '-';
        return `${sign}$${Math.abs(amount).toLocaleString('es-MX', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const getTypeColor = (type: string) => {
        return theme.colors.types[type as keyof typeof theme.colors.types] || theme.colors.primary;
    };

    const handleDeleteTransaction = (transactionId: string) => {
        Alert.alert(
            'Eliminar transacción',
            '¿Estás seguro? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', onPress: () => setShowActionMenu(false), style: 'cancel' },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            await deleteTransaction(transactionId);
                            setShowActionMenu(false);
                            setSelectedTransactionId(null);
                            onTransactionDeleted?.();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo eliminar la transacción');
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const renderTransactionItem = ({ item, index }: any) => {
        const category = categories.find(c => c.id === item.category_id);
        const color = getTypeColor(item.type);
        const isSelected = selectedTransactionId === item.id;

        return (
            <TouchableOpacity
                key={item.id}
                style={[
                    styles.transactionItem,
                    index === grouped.flatMap(g => g.transactions).length - 1 && styles.lastItem,
                ]}
                onPress={() => {
                    setSelectedTransactionId(item.id);
                    setShowActionMenu(true);
                }}
                activeOpacity={0.7}
            >
                <View style={styles.leftContent}>
                    <View style={[styles.iconWrapper, { backgroundColor: `${color}20` }]}>
                        <CategoryIcon name={category?.icon || 'wallet-outline'} color={color} size={20} />
                    </View>
                    <View style={styles.textContent}>
                        <Text style={styles.categoryName}>{category?.name || 'Sin categoría'}</Text>
                        <Text style={styles.description} numberOfLines={1}>
                            {item.description || 'Sin descripción'}
                        </Text>
                    </View>
                </View>
                <View style={styles.rightContent}>
                    <Text style={[styles.amount, { color }]}>
                        {formatAmount(item.amount, item.type)}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                </View>
            </TouchableOpacity>
        );
    };

    const renderDateGroup = ({ item }: any) => {
        const dateGroup = item as GroupedTransactions;

        return (
            <View key={dateGroup.date} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                    <Text style={styles.dateLabel}>{dateGroup.label}</Text>
                    <Text style={styles.dateSummary}>
                        {dateGroup.transactions.length} transacción{dateGroup.transactions.length !== 1 ? 'es' : ''}
                    </Text>
                </View>
                {dateGroup.transactions.map((transaction, index) => (
                    <TouchableOpacity
                        key={transaction.id}
                        style={[
                            styles.transactionItem,
                            index === dateGroup.transactions.length - 1 && styles.lastItem,
                        ]}
                        onPress={() => {
                            setSelectedTransactionId(transaction.id);
                            setShowActionMenu(true);
                        }}
                        activeOpacity={0.7}
                    >
                        <View style={styles.leftContent}>
                            <View
                                style={[
                                    styles.iconWrapper,
                                    { backgroundColor: `${getTypeColor(transaction.type)}20` },
                                ]}
                            >
                                <CategoryIcon
                                    name={
                                        categories.find(c => c.id === transaction.category_id)?.icon ||
                                        'wallet-outline'
                                    }
                                    color={getTypeColor(transaction.type)}
                                    size={20}
                                />
                            </View>
                            <View style={styles.textContent}>
                                <Text style={styles.categoryName}>
                                    {categories.find(c => c.id === transaction.category_id)?.name ||
                                        'Sin categoría'}
                                </Text>
                                <Text style={styles.description} numberOfLines={1}>
                                    {transaction.description || 'Sin descripción'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.rightContent}>
                            <Text
                                style={[
                                    styles.amount,
                                    { color: getTypeColor(transaction.type) },
                                ]}
                            >
                                {formatAmount(transaction.amount, transaction.type)}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={grouped}
                renderItem={renderDateGroup}
                keyExtractor={(item, index) => `${item.date}-${index}`}
                scrollEnabled={false}
                nestedScrollEnabled={true}
            />

            <Modal visible={showActionMenu} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => {
                        setShowActionMenu(false);
                        setSelectedTransactionId(null);
                    }}
                >
                    <View style={styles.actionMenu}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                setShowActionMenu(false);
                                router.push(`/(app)/transactions/${selectedTransactionId}`);
                            }}
                        >
                            <Ionicons name="pencil-outline" size={20} color={theme.colors.primary} />
                            <Text style={styles.actionText}>Editar</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                if (selectedTransactionId) {
                                    handleDeleteTransaction(selectedTransactionId);
                                }
                            }}
                        >
                            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
                            <Text style={[styles.actionText, { color: theme.colors.error }]}>Eliminar</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                setShowActionMenu(false);
                                setSelectedTransactionId(null);
                            }}
                        >
                            <Ionicons name="close-outline" size={20} color={theme.colors.textMuted} />
                            <Text style={[styles.actionText, { color: theme.colors.textMuted }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    dateGroup: {
        marginBottom: 20,
    },
    dateHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        marginBottom: 8,
    },
    dateLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        textTransform: 'capitalize',
    },
    dateSummary: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.colors.card,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    lastItem: {
        borderBottomWidth: 0,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    leftContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContent: {
        flex: 1,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text,
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    rightContent: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    amount: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionMenu: {
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        overflow: 'hidden',
        minWidth: 200,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border,
    },
});
