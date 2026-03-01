import { theme } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export interface CardProps {
    children: React.ReactNode;
    padding?: number;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    shadow?: 'none' | 'sm' | 'md';
}

export function Card({ children, padding = theme.spacing[16], onPress, style, shadow = 'sm' }: CardProps) {
    const shadowStyle = getShadowStyle(shadow);

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.card,
                    shadowStyle,
                    { padding, opacity: pressed ? 0.8 : 1 },
                    style,
                ]}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View style={[styles.card, shadowStyle, { padding }, style]}>
            {children}
        </View>
    );
}

function getShadowStyle(shadow: 'none' | 'sm' | 'md') {
    switch (shadow) {
        case 'none':
            return {};
        case 'sm':
            return {
                shadowColor: theme.colors.black,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
            };
        case 'md':
            return {
                shadowColor: theme.colors.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
                elevation: 4,
            };
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
    },
});
