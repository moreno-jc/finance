import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

export interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={64} color={theme.colors.border} style={styles.icon} />
            <Text style={styles.title}>{title}</Text>
            {description && <Text style={styles.description}>{description}</Text>}
            {actionLabel && onAction && (
                <Button
                    label={actionLabel}
                    onPress={onAction}
                    variant="secondary"
                    style={styles.button}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing[32],
    },
    icon: {
        marginBottom: theme.spacing[16],
    },
    title: {
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing[8],
        textAlign: 'center',
    },
    description: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: theme.spacing[24],
    },
    button: {
        marginTop: theme.spacing[8],
    },
});
