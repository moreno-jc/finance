import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    placeholder?: string;
}

export function SearchBar({ value, onChangeText, onClear, placeholder = 'Buscar transacciones...' }: SearchBarProps) {
    return (
        <View style={styles.container}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textMuted}
                value={value}
                onChangeText={onChangeText}
            />
            {value.length > 0 && (
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                        onChangeText('');
                        onClear?.();
                    }}
                >
                    <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginHorizontal: 16,
        marginVertical: 12,
        height: 40,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text,
        paddingVertical: 8,
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },
});
