import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useTransactionStore } from '@/store/transactionStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

const transactionSchema = z.object({
    amount: z.string().min(1, 'El monto es obligatorio').refine((val) => !isNaN(Number(val)), 'El monto debe ser un número'),
    description: z.string().min(3, 'Mínimo 3 caracteres'),
    type: z.enum(['income', 'expense', 'saving', 'investment', 'debt']),
    category_id: z.string().min(1, 'La categoría es obligatoria'),
    date: z.string(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function TransactionForm() {
    const { user } = useAuthStore();
    const router = useRouter();
    const { addTransaction, categories, fetchCategories, loading } = useTransactionStore();
    const [selectedType, setSelectedType] = useState<'income' | 'expense' | 'saving' | 'investment' | 'debt'>('expense');

    useEffect(() => {
        if (user) {
            fetchCategories(user.id);
        }
    }, [user]);

    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            amount: '',
            description: '',
            type: 'expense',
            category_id: '',
            date: new Date().toISOString().split('T')[0],
        },
    });

    const selectedCategoryId = watch('category_id');

    const onSubmit = async (data: TransactionFormData) => {
        if (!user) return;

        await addTransaction({
            user_id: user.id,
            amount: Number(data.amount),
            description: data.description,
            type: data.type,
            category_id: data.category_id,
            date: data.date,
        });

        router.replace('/(app)');
    };

    const handleTypeChange = (type: any) => {
        setSelectedType(type);
        setValue('type', type);
        // Reset category if not in type
        const filteredCategories = categories.filter(c => c.type === type);
        if (filteredCategories.length > 0) {
            setValue('category_id', filteredCategories[0].id);
        } else {
            setValue('category_id', '');
        }
    };

    const filteredCategories = categories.filter(c => c.type === selectedType);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

            <Card style={styles.card}>
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
                            <Text style={[styles.categoryIcon, { color: cat.color }]}>{cat.icon}</Text>
                            <Text style={[styles.categoryText, { color: cat.color }]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                    {filteredCategories.length === 0 && (
                        <Text style={styles.emptyCategories}>Cargando categorías...</Text>
                    )}
                </View>

                <Button
                    label="Registrar Transacción"
                    onPress={handleSubmit(onSubmit)}
                    isLoading={loading}
                    style={styles.submitButton}
                />
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: theme.spacing[16],
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
        padding: theme.spacing[20],
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
        marginBottom: theme.spacing[24],
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing[12],
        paddingVertical: theme.spacing[4],
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
    },
    categoryIcon: {
        marginRight: theme.spacing[4],
        fontSize: 16,
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
    submitButton: {
        marginTop: theme.spacing[16],
    },
});
