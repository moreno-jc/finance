import { FilterModal, FilterState } from '@/components/transactions/FilterModal';
import { SearchBar } from '@/components/transactions/SearchBar';
import { TransactionList } from '@/components/transactions/TransactionList';
import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useTransactionStore } from '@/store/transactionStore';
import { getDateRangeForPeriod } from '@/types/filters';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TransactionsScreen() {
    const { user } = useAuthStore();
    const router = useRouter();
    const {
        fetchTransactions,
        fetchCategories,
        setSearchQuery,
        setActiveFilters,
        clearFilters,
        getGroupedTransactions,
        searchQuery,
        activeFilters,
        categories,
        loading,
    } = useTransactionStore();

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasFiltersApplied, setHasFiltersApplied] = useState(false);

    // Load transactions on focus
    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchTransactions(user.id);
                fetchCategories(user.id);
            }
        }, [user])
    );

    // Update filter indicator
    useEffect(() => {
        const hasFilters = (activeFilters.types && activeFilters.types.length > 0) ||
                          (activeFilters.categories && activeFilters.categories.length > 0) ||
                          (activeFilters.dateRange !== undefined);
        setHasFiltersApplied(hasFilters);
    }, [activeFilters]);

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        if (user) {
            await fetchTransactions(user.id);
            await fetchCategories(user.id);
        }
        setIsRefreshing(false);
    }, [user, fetchTransactions, fetchCategories]);

    const handleApplyFilters = (filters: FilterState) => {
        const dateRange = getDateRangeForPeriod(
            filters.datePeriod,
            filters.customRange
        );

        setActiveFilters({
            types: filters.types,
            categories: filters.categories,
            dateRange,
        });
    };

    const handleClearFilters = () => {
        clearFilters();
    };

    const groupedTransactions = getGroupedTransactions();
    const isEmpty = groupedTransactions.length === 0;

    return (
        <View style={styles.container}>
            <AppHeader
                title="Transacciones"
                rightAction={
                    <Button
                        label="Nueva"
                        size="sm"
                        onPress={() => router.push('/(app)/transactions/new')}
                    />
                }
            />

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        hasFiltersApplied && styles.filterButtonActive,
                    ]}
                    onPress={() => setShowFilterModal(true)}
                >
                    <Ionicons
                        name="filter"
                        size={18}
                        color={hasFiltersApplied ? theme.colors.primary : theme.colors.textMuted}
                    />
                    <Text
                        style={[
                            styles.filterButtonText,
                            hasFiltersApplied && styles.filterButtonTextActive,
                        ]}
                    >
                        Filtros
                    </Text>
                    {hasFiltersApplied && (
                        <View style={styles.filterIndicator} />
                    )}
                </TouchableOpacity>

                {hasFiltersApplied && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={handleClearFilters}
                    >
                        <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
                        <Text style={styles.clearButtonText}>Limpiar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {isEmpty ? (
                <ScrollView
                    style={styles.emptyContainer}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.emptyContent}>
                        <Ionicons
                            name="wallet-outline"
                            size={64}
                            color={theme.colors.textMuted}
                        />
                        <Text style={styles.emptyTitle}>Sin transacciones</Text>
                        <Text style={styles.emptyText}>
                            {searchQuery || hasFiltersApplied
                                ? 'No hay transacciones que coincidan con los criterios de búsqueda.'
                                : 'Comienza registrando tu primera transacción.'}
                        </Text>
                        <Button
                            label="Crear transacción"
                            onPress={() => router.push('/(app)/transactions/new')}
                            style={styles.emptyButton}
                        />
                    </View>
                </ScrollView>
            ) : (
                <ScrollView
                    style={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.listContent}>
                        <TransactionList
                            grouped={groupedTransactions}
                            onTransactionDeleted={onRefresh}
                        />
                    </View>
                </ScrollView>
            )}

            <FilterModal
                visible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApply={handleApplyFilters}
                categories={categories}
                initialFilters={activeFilters}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterButtonActive: {
        backgroundColor: `${theme.colors.primary}15`,
        borderColor: theme.colors.primary,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.textMuted,
    },
    filterButtonTextActive: {
        color: theme.colors.primary,
    },
    filterIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    clearButtonText: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.textMuted,
    },
    emptyContainer: {
        flex: 1,
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
        minHeight: 400,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        marginTop: 16,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});
