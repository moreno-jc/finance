import { theme } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export function Button({
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    fullWidth = false,
    style,
    textStyle,
}: ButtonProps) {
    const handlePress = () => {
        if (disabled || isLoading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    container: { backgroundColor: theme.colors.primary, borderWidth: 1, borderColor: theme.colors.primary },
                    text: { color: theme.colors.white },
                };
            case 'secondary':
                return {
                    container: { backgroundColor: theme.colors.transparent, borderWidth: 1, borderColor: theme.colors.primary },
                    text: { color: theme.colors.primary },
                };
            case 'ghost':
                return {
                    container: { backgroundColor: theme.colors.transparent, borderWidth: 1, borderColor: theme.colors.transparent },
                    text: { color: theme.colors.textMuted },
                };
            case 'danger':
                return {
                    container: { backgroundColor: theme.colors.error, borderWidth: 1, borderColor: theme.colors.error },
                    text: { color: theme.colors.white },
                };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { paddingVertical: theme.spacing[8], paddingHorizontal: theme.spacing[12], fontSize: theme.typography.sizes.sm };
            case 'md':
                return { paddingVertical: theme.spacing[12], paddingHorizontal: theme.spacing[16], fontSize: theme.typography.sizes.base };
            case 'lg':
                return { paddingVertical: theme.spacing[16], paddingHorizontal: theme.spacing[24], fontSize: theme.typography.sizes.lg };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled || isLoading}
            style={({ pressed }) => [
                styles.base,
                variantStyles.container,
                {
                    paddingVertical: sizeStyles.paddingVertical,
                    paddingHorizontal: sizeStyles.paddingHorizontal,
                    width: fullWidth ? '100%' : undefined,
                    opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
                    transform: [{ scale: pressed && !disabled && !isLoading ? 0.97 : 1 }],
                },
                style,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={variantStyles.text.color} />
            ) : (
                <>
                    {leftIcon && leftIcon}
                    <Text
                        style={[
                            styles.text,
                            variantStyles.text,
                            { fontSize: sizeStyles.fontSize, marginLeft: leftIcon ? theme.spacing[8] : 0 },
                            textStyle,
                        ]}
                    >
                        {label}
                    </Text>
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.md,
    },
    text: {
        fontWeight: theme.typography.weights.medium,
        textAlign: 'center',
    },
});
