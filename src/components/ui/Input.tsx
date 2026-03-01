import { theme } from '@/constants/theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

export interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    disabled?: boolean;
}

export function Input({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    disabled,
    style,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    disabled && styles.inputDisabled,
                ]}
            >
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={theme.colors.textLight}
                    editable={!disabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />
                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : helperText ? (
                <Text style={styles.helperText}>{helperText}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing[16],
        width: '100%',
    },
    label: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing[4],
        fontWeight: theme.typography.weights.medium,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing[12],
        minHeight: 48,
    },
    inputFocused: {
        borderColor: theme.colors.borderFocus,
        borderWidth: 2,
        backgroundColor: theme.colors.white,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    inputDisabled: {
        opacity: 0.6,
        backgroundColor: theme.colors.border,
    },
    input: {
        flex: 1,
        fontSize: theme.typography.sizes.base,
        color: theme.colors.text,
        paddingVertical: theme.spacing[12],
    },
    leftIcon: {
        marginRight: theme.spacing[8],
    },
    rightIcon: {
        marginLeft: theme.spacing[8],
    },
    errorText: {
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.error,
        marginTop: theme.spacing[4],
    },
    helperText: {
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.textLight,
        marginTop: theme.spacing[4],
    },
});
