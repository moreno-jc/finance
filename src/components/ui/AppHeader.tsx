import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface AppHeaderProps {
    title: string;
    subtitle?: string;
    rightAction?: React.ReactNode;
    showBackButton?: boolean;
    onBack?: () => void;
}

export function AppHeader({ title, subtitle, rightAction, showBackButton, onBack }: AppHeaderProps) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    {showBackButton && (
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    )}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                </View>
                {rightAction && <View style={styles.actionContainer}>{rightAction}</View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing[16],
        paddingVertical: theme.spacing[12],
        minHeight: 60,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: theme.spacing[12],
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    actionContainer: {
        marginLeft: theme.spacing[16],
    },
});
