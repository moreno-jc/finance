import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { TransactionType } from '@/types/app';
import { DateFilterPeriod, DateRange, getDateRangeForPeriod } from '@/types/filters';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export interface FilterState {
    types: TransactionType[];
    categories: string[];
    datePeriod: DateFilterPeriod;
    customRange?: DateRange;
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    categories: { id: string; name: string; type: TransactionType }[];
    initialFilters?: FilterState;
}

const TRANSACTION_TYPES: { label: string; value: TransactionType }[] = [
    { label: 'Ingresos', value: 'income' },
    { label: 'Gastos', value: 'expense' },
    { label: 'Ahorros', value: 'saving' },
    { label: 'Inversiones', value: 'investment' },
    { label: 'Deudas', value: 'debt' },
];

const DATE_PERIODS: { label: string; value: DateFilterPeriod }[] = [
    { label: 'Hoy', value: 'today' },
    { label: 'Esta semana', value: 'week' },
    { label: 'Este mes', value: 'month' },
    { label: 'Personalizado', value: 'custom' },
];

export function FilterModal({
    visible,
    onClose,
    onApply,
    categories,
    initialFilters,
}: FilterModalProps) {
    const [selectedTypes, setSelectedTypes] = useState<TransactionType[]>(initialFilters?.types || []);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        initialFilters?.categories || []
    );
    const [datePeriod, setDatePeriod] = useState<DateFilterPeriod>(initialFilters?.datePeriod || 'month');
    const [customRange, setCustomRange] = useState<DateRange | undefined>(initialFilters?.customRange);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleTypeToggle = (type: TransactionType) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
        );
    };

    const handleStartDateChange = (event: any, date?: Date) => {
        if (Platform.OS === 'android') {
            setShowStartDatePicker(false);
        }
        if (date) {
            const dateStr = date.toISOString().split('T')[0];
            setCustomRange(prev => ({ start: dateStr, end: prev?.end || dateStr }));
        }
    };

    const handleEndDateChange = (event: any, date?: Date) => {
        if (Platform.OS === 'android') {
            setShowEndDatePicker(false);
        }
        if (date) {
            const dateStr = date.toISOString().split('T')[0];
            setCustomRange(prev => ({ start: prev?.start || dateStr, end: dateStr }));
        }
    };

    const handleApply = () => {
        const range = datePeriod === 'custom' 
            ? customRange 
            : getDateRangeForPeriod(datePeriod);

        onApply({
            types: selectedTypes,
            categories: selectedCategories,
            datePeriod,
            customRange: datePeriod === 'custom' ? customRange : undefined,
        });
        onClose();
    };

    const handleClearFilters = () => {
        setSelectedTypes([]);
        setSelectedCategories([]);
        setDatePeriod('month');
        setCustomRange(undefined);
    };

    const startDate = customRange?.start ? new Date(customRange.start) : new Date();
    const endDate = customRange?.end ? new Date(customRange.end) : new Date();

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Filtros</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* Type Filters */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Tipo de transacción</Text>
                        <View style={styles.optionsGrid}>
                            {TRANSACTION_TYPES.map(type => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={[
                                        styles.filterOption,
                                        selectedTypes.includes(type.value) && styles.filterOptionSelected,
                                    ]}
                                    onPress={() => handleTypeToggle(type.value)}
                                >
                                    <Text
                                        style={[
                                            styles.filterOptionText,
                                            selectedTypes.includes(type.value) &&
                                                styles.filterOptionTextSelected,
                                        ]}
                                    >
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Category Filters */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Categorías</Text>
                        <View style={styles.categoriesContainer}>
                            {categories.map(cat => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryItem,
                                        selectedCategories.includes(cat.id) && styles.categoryItemSelected,
                                    ]}
                                    onPress={() => handleCategoryToggle(cat.id)}
                                >
                                    <View
                                        style={[
                                            styles.checkbox,
                                            selectedCategories.includes(cat.id) && styles.checkboxChecked,
                                        ]}
                                    >
                                        {selectedCategories.includes(cat.id) && (
                                            <Ionicons
                                                name="checkmark"
                                                size={16}
                                                color={theme.colors.card}
                                            />
                                        )}
                                    </View>
                                    <Text style={styles.categoryName}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Date Filters */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Período</Text>
                        {DATE_PERIODS.map(period => (
                            <TouchableOpacity
                                key={period.value}
                                style={[
                                    styles.dateOption,
                                    datePeriod === period.value && styles.dateOptionSelected,
                                ]}
                                onPress={() => {
                                    setDatePeriod(period.value);
                                    if (period.value !== 'custom') {
                                        setCustomRange(undefined);
                                    }
                                }}
                            >
                                <View
                                    style={[
                                        styles.radioButton,
                                        datePeriod === period.value && styles.radioButtonSelected,
                                    ]}
                                >
                                    {datePeriod === period.value && (
                                        <View style={styles.radioButtonInner} />
                                    )}
                                </View>
                                <Text style={styles.dateOptionText}>{period.label}</Text>
                            </TouchableOpacity>
                        ))}

                        {datePeriod === 'custom' && (
                            <View style={styles.customDateContainer}>
                                <View style={styles.dateInputGroup}>
                                    <Text style={styles.dateLabel}>Desde:</Text>
                                    <TouchableOpacity
                                        style={styles.dateButton}
                                        onPress={() => setShowStartDatePicker(true)}
                                    >
                                        <Text style={styles.dateButtonText}>
                                            {startDate.toLocaleDateString('es-MX')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.dateInputGroup}>
                                    <Text style={styles.dateLabel}>Hasta:</Text>
                                    <TouchableOpacity
                                        style={styles.dateButton}
                                        onPress={() => setShowEndDatePicker(true)}
                                    >
                                        <Text style={styles.dateButtonText}>
                                            {endDate.toLocaleDateString('es-MX')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button
                        label="Limpiar"
                        variant="secondary"
                        onPress={handleClearFilters}
                    />
                    <Button
                        label="Aplicar"
                        onPress={handleApply}
                    />
                </View>

                {showStartDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleStartDateChange}
                    />
                )}

                {showEndDatePicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleEndDateChange}
                    />
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
    },
    filterOptionSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterOptionText: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.text,
    },
    filterOptionTextSelected: {
        color: theme.colors.card,
    },
    categoriesContainer: {
        gap: 8,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    categoryItemSelected: {
        backgroundColor: `${theme.colors.primary}15`,
        borderColor: theme.colors.primary,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: theme.colors.textMuted,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    categoryName: {
        fontSize: 14,
        color: theme.colors.text,
        flex: 1,
    },
    dateOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    dateOptionSelected: {
        backgroundColor: `${theme.colors.primary}15`,
        borderColor: theme.colors.primary,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.textMuted,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    radioButtonSelected: {
        borderColor: theme.colors.primary,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
    },
    dateOptionText: {
        fontSize: 14,
        color: theme.colors.text,
    },
    customDateContainer: {
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    dateInputGroup: {
        marginBottom: 12,
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.textMuted,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    dateButton: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: theme.colors.background,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    dateButtonText: {
        fontSize: 14,
        color: theme.colors.text,
    },
    footer: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
});
