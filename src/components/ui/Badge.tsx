import { theme } from '@/constants/theme';
import { TransactionType } from '@/types/app';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface BadgeProps {
    label: string;
    type?: TransactionType;
    color?: string; // override
    size?: 'sm' | 'md';
}

function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Badge({ label, type, color, size = 'md' }: BadgeProps) {
    const baseColor = color || (type ? theme.colors.types[type] : theme.colors.primary);
    const backgroundColor = hexToRgba(baseColor, 0.15);

    const sizeStyles = {
        sm: { paddingVertical: 3, paddingHorizontal: 8, fontSize: 11 },
        md: { paddingVertical: 4, paddingHorizontal: 10, fontSize: 11 },
    };

    return (
        <View style={[styles.container, { backgroundColor, paddingVertical: sizeStyles[size].paddingVertical, paddingHorizontal: sizeStyles[size].paddingHorizontal }]}>
            <Text style={[styles.text, { color: baseColor, fontSize: sizeStyles[size].fontSize }]}>
                {label}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borderRadius.full,
        alignSelf: 'flex-start',
    },
    text: {
        fontWeight: theme.typography.weights.semibold,
    },
});
