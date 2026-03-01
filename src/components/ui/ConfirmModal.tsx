import { theme } from '@/constants/theme';
import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { Card } from './Card';

export interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDanger?: boolean;
    isLoading?: boolean;
}

export function ConfirmModal({
    visible,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
    isDanger = false,
    isLoading = false,
}: ConfirmModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.cardWrapper}>
                    <Card padding={theme.spacing[24]}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.message}>{message}</Text>

                        <View style={styles.buttonContainer}>
                            <Button
                                label={cancelLabel}
                                onPress={onCancel}
                                variant="ghost"
                                disabled={isLoading}
                                style={styles.cancelButton}
                            />
                            <Button
                                label={confirmLabel}
                                onPress={onConfirm}
                                variant={isDanger ? 'danger' : 'primary'}
                                isLoading={isLoading}
                            />
                        </View>
                    </Card>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing[24],
    },
    cardWrapper: {
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing[12],
    },
    message: {
        fontSize: theme.typography.sizes.base,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing[24],
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    cancelButton: {
        marginRight: theme.spacing[12],
    },
});
