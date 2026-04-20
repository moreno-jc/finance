import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { Input } from '@/components/ui/Input';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useTransactionStore } from '@/store/transactionStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { z } from 'zod';

const editTransactionSchema = z.object({
    amount: z.string().min(1, 'El monto es obligatorio').refine((val) => !isNaN(Number(val)), 'El monto debe ser un número'),
    description: z.string().min(3, 'Mínimo 3 caracteres'),
    type: z.enum(['income', 'expense', 'saving', 'investment', 'debt']),
    category_id: z.string().min(1, 'La categoría es obligatoria'),
    date: z.string(),
});

type EditTransactionFormData = z.infer<typeof editTransactionSchema>;

export default function EditTransactionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuthStore();
    const { transactions, categories, updateTransaction, deleteTransaction, loading } = useTransactionStore();
    
    const [selectedType, setSelectedType] = useState<'income' | 'expense' | 'saving' | 'investment' | 'debt'>('expense');
    const [transaction, setTransaction] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<EditTransactionFormData>({
        resolver: zodResolver(editTransactionSchema),
        defaultValues: {
            amount: '',
            description: '',
            type: 'expense',
            category_id: '',
            date: new Date().toISOString().split('T')[0],
        },
    });

    const selectedCategoryId = watch('category_id');

    useEffect(() => {
        if (id && transactions.length > 0) {
            const tx = transactions.find(t => t.id === id);
            if (tx) {
                setTransaction(tx);
                setSelectedType(tx.type);
                setValue('amount', String(tx.amount));
                setValue('description', tx.description || '');
                setValue('type', tx.type);
                setValue('category_id', tx.category_id || '');
                setValue('date', tx.date.split('T')[0]);
            }
            setIsLoading(false);
        }
    }, [id, transactions, setValue]);

    const onSubmit = async (data: EditTransactionFormData) => {
        if (!id) return;

        try {
            await updateTransaction(id, {
                amount: Number(data.amount),
                description: data.description,
                type: data.type,
                category_id: data.category_id,
                date: data.date,
            });

            Alert.alert('Éxito', 'Transacción actualizada correctamente');
            router.replace('/(app)/transactions');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'No se pudo actualizar la transacción');
        }
    };

    const handleDelete = () => {
        Alert.alert(
            'Eliminar transacción',
            '¿Estás seguro? Esta acción no se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        if (!id) return;
                        try {
                            await deleteTransaction(id);
                            Alert.alert('Éxito', 'Transacción eliminada correctamente');
                            router.replace('/(app)/transactions');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'No se pudo eliminar la transacción');
                        }
                    },
                },
            ]
        );
    };

    const handleTypeChange = (type: any) => {
        setSelectedType(type);
        setValue('type', type);
        const filteredCategories = categories.filter(c => c.type === type);
        if (filteredCategories.length > 0) {
            setValue('category_id', filteredCategories[0].id);
        } else {
            setValue('category_id', '');
        }
    };

    const filteredCategories = categories.filter(c => c.type === selectedType);

    if (isLoading || !transaction) {
        return (
            <View style={styles.container}>
                <AppHeader title="Editar Transacción" showBackButton />
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Cargando...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader title="Editar Transacción" showBackButton />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.content}>
                    <View style={styles.typeSelector}>
                        {(['expense', 'income', 'saving', 'investment', 'debt'] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeButton,
                                    selectedType === type && {
                                        backgroundColor: theme.colors.types[type],
                                        borderColor: theme.colors.types[type]
                                    }
                                ]}
                                onPress={() => handleTypeChange(type)}
                            >
                                <Text style={[
                                    styles.typeText,
                                    selectedType === type && { color: theme.colors.white }
                                ]}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.card}>
                        <Controller
                            control={control}
                            name="amount"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Monto"
                                    placeholder="0.00"
                                    keyboardType="numeric"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.amount?.message}
                                    leftIcon={<Text style={styles.currencySymbol}>$</Text>}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    label="Descripción"
                                    placeholder="Ej. Súper semanal"
                                    value={value}
                                    onChangeText={onChange}
                                    error={errors.description?.message}
                                />
                            )}
                        />

                        <Text style={styles.label}>Categoría</Text>
                        <View style={styles.categoriesContainer}>
                            {filteredCategories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryChip,
                                        { borderColor: cat.color },
                                        selectedCategoryId === cat.id && { backgroundColor: cat.color + '20' }
                                    ]}
                                    onPress={() => setValue('category_id', cat.id)}
                                >
                                    <CategoryIcon icon={cat.icon} size={16} color={cat.color} />
                                    <Text style={[styles.categoryText, { color: cat.color }]}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                            {filteredCategories.length === 0 && (
                                <Text style={styles.emptyCategories}>No hay categorías disponibles</Text>
                            )}
                        </View>
                        {errors.category_id && (
                            <Text style={styles.errorText}>{errors.category_id.message}</Text>
                        )}

                        <View style={styles.buttonGroup}>
                            <Button
                                label="Guardar"
                                onPress={handleSubmit(onSubmit)}
                                isLoading={loading}
                            />
                            <Button
                                label="Eliminar"
                                variant="danger"
                                onPress={handleDelete}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        padding: theme.spacing[16],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: theme.colors.textMuted,
    },
    typeSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing[8],
        marginBottom: theme.spacing[16],
    },
    typeButton: {
        paddingHorizontal: theme.spacing[12],
        paddingVertical: theme.spacing[8],
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
    },
    typeText: {
        fontSize: theme.typography.sizes.sm,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.textMuted,
    },
    card: {
        paddingBottom: theme.spacing[20],
    },
    label: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing[8],
        fontWeight: theme.typography.weights.medium,
    },
    currencySymbol: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.textMuted,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing[8],
        marginBottom: theme.spacing[12],
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[12],
        paddingVertical: theme.spacing[4],
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
    },
    categoryText: {
        fontSize: theme.typography.sizes.xs,
        fontWeight: theme.typography.weights.medium,
    },
    emptyCategories: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textLight,
        textAlign: 'center',
        width: '100%',
    },
    errorText: {
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.error,
        marginBottom: theme.spacing[12],
    },
    buttonGroup: {
        gap: theme.spacing[12],
        marginTop: theme.spacing[20],
    },
});
