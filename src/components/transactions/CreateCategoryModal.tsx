import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { theme } from '@/constants/theme';
import { TransactionType } from '@/types/app';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const TRANSACTION_TYPES: { label: string; value: TransactionType; icon: string }[] = [
    { label: 'Ingreso', value: 'income', icon: 'cash-outline' },
    { label: 'Gasto', value: 'expense', icon: 'wallet-outline' },
    { label: 'Ahorro', value: 'saving', icon: 'shield-checkmark-outline' },
    { label: 'Inversión', value: 'investment', icon: 'trending-up-outline' },
    { label: 'Deuda', value: 'debt', icon: 'card-outline' },
];

const PREDEFINED_COLORS = [
    '#FF6B6B', // Red
    '#FF9800', // Orange
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FFC107', // Amber
    '#F44336', // Deep Red
    '#673AB7', // Deep Purple
    '#3F51B5', // Indigo
];

interface CreateCategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onCreated: (category: { name: string; type: TransactionType; icon: string; color: string }) => void;
}

export function CreateCategoryModal({ visible, onClose, onCreated }: CreateCategoryModalProps) {
    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState<TransactionType>('expense');
    const [selectedIcon, setSelectedIcon] = useState('wallet-outline');
    const [selectedColor, setSelectedColor] = useState(theme.colors.types.expense);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleTypeChange = (type: TransactionType) => {
        setSelectedType(type);
        const typeIcon = TRANSACTION_TYPES.find(t => t.value === type)?.icon || 'wallet-outline';
        setSelectedIcon(typeIcon);
        setSelectedColor(theme.colors.types[type]);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Mínimo 2 caracteres';
        } else if (name.trim().length > 30) {
            newErrors.name = 'Máximo 30 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = () => {
        if (!validateForm()) return;

        onCreated({
            name: name.trim(),
            type: selectedType,
            icon: selectedIcon,
            color: selectedColor,
        });

        // Reset form
        setName('');
        setSelectedType('expense');
        setSelectedIcon('wallet-outline');
        setSelectedColor(theme.colors.types.expense);
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        setName('');
        setSelectedType('expense');
        setSelectedIcon('wallet-outline');
        setSelectedColor(theme.colors.types.expense);
        setErrors({});
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nueva Categoría</Text>
                    <TouchableOpacity onPress={handleClose}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    {/* Category Name Input */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Nombre de la categoría</Text>
                        <Input
                            placeholder="ej: Suscripciones"
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                if (errors.name) {
                                    setErrors({ ...errors, name: '' });
                                }
                            }}
                            error={errors.name}
                        />
                    </View>

                    {/* Type Selection */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Tipo de transacción</Text>
                        <View style={styles.typeGrid}>
                            {TRANSACTION_TYPES.map(type => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={[
                                        styles.typeOption,
                                        selectedType === type.value && styles.typeOptionSelected,
                                    ]}
                                    onPress={() => handleTypeChange(type.value)}
                                >
                                    <Ionicons
                                        name={type.icon as any}
                                        size={24}
                                        color={
                                            selectedType === type.value
                                                ? theme.colors.card
                                                : theme.colors.types[type.value]
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.typeOptionText,
                                            selectedType === type.value && styles.typeOptionTextSelected,
                                        ]}
                                    >
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Color Selection */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Color</Text>
                        <View style={styles.colorGrid}>
                            {PREDEFINED_COLORS.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.colorOptionSelected,
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                >
                                    {selectedColor === color && (
                                        <Ionicons name="checkmark" size={20} color="white" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Preview */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Vista previa</Text>
                        <View style={styles.previewContainer}>
                            <View style={[styles.previewIcon, { backgroundColor: `${selectedColor}20` }]}>
                                <Ionicons name={selectedIcon as any} size={32} color={selectedColor} />
                            </View>
                            <View style={styles.previewText}>
                                <Text style={styles.previewName}>{name || 'Nombre categoría'}</Text>
                                <Text style={styles.previewType}>{selectedType}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <Button label="Cancelar" variant="secondary" onPress={handleClose} />
                    <Button label="Crear" onPress={handleCreate} />
                </View>
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
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 12,
    },
    typeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeOption: {
        flex: 1,
        minWidth: '30%',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        alignItems: 'center',
        gap: 8,
    },
    typeOptionSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    typeOptionText: {
        fontSize: 12,
        fontWeight: '500',
        color: theme.colors.text,
    },
    typeOptionTextSelected: {
        color: theme.colors.card,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorOption: {
        width: '18%',
        aspectRatio: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    colorOptionSelected: {
        borderColor: theme.colors.text,
    },
    previewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    previewIcon: {
        width: 50,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    previewText: {
        flex: 1,
    },
    previewName: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    previewType: {
        fontSize: 12,
        color: theme.colors.textMuted,
        textTransform: 'capitalize',
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
