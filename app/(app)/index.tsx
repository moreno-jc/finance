import { DashboardCharts } from '@/components/charts/DashboardCharts';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ComparisonCards } from '@/components/dashboard/ComparisonCards';
import { DateHeader } from '@/components/dashboard/DateHeader';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { AppHeader } from '@/components/ui/AppHeader';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useTransactionStore } from '@/store/transactionStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
    const { user } = useAuthStore();
    const router = useRouter();
    const { transactions, fetchTransactions, fetchCategories, loading } = useTransactionStore();

    useEffect(() => {
        if (user) {
            fetchTransactions(user.id);
            fetchCategories(user.id);
        }
    }, [user]);

    const onRefresh = () => {
        if (user) {
            fetchTransactions(user.id);
            fetchCategories(user.id);
        }
    };

    const features = [
        { icon: 'add-circle-outline', title: 'Registro Manual', desc: 'Añade tus gastos e ingresos fácilmente.' },
        { icon: 'stats-chart-outline', title: 'Gráficos Inteligentes', desc: 'Visualiza tus finanzas por categoría y tiempo.' },
        { icon: 'mail-outline', title: 'Sync con Gmail', desc: 'Importa tus tickets bancarios automáticamente.' },
        { icon: 'notifications-outline', title: 'Alertas de Gasto', desc: 'Recibe avisos cuando te acerques a tus límites.' },
    ];

    return (
        <View style={styles.container}>
            <AppHeader
                title="Dashboard"
                subtitle={`Hola, ${user?.user_metadata?.full_name || 'Usuario'}`}
            />

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={onRefresh} />
                }
            >
                {transactions.length > 0 ? (
                    <>
                        <DateHeader />
                        <BalanceCard />
                        <ComparisonCards />
                        <DashboardCharts />
                        <RecentTransactions />
                    </>
                ) : (
                    <View style={styles.welcomeContainer}>
                        <Ionicons name="sparkles" size={48} color={theme.colors.primary} />
                        <Text style={styles.welcomeTitle}>¡Bienvenido a tu nueva vida financiera!</Text>
                        <Text style={styles.welcomeDesc}>
                            Comienza registrando tu primera transacción para desbloquear los gráficos y el análisis detallado.
                        </Text>

                        <View style={styles.featureList}>
                            <Text style={styles.featureListTitle}>¿Qué puedes hacer?</Text>
                            {features.map((f, i) => (
                                <View key={i} style={styles.featureItem}>
                                    <Ionicons name={f.icon as any} size={24} color={theme.colors.primary} />
                                    <View style={styles.featureText}>
                                        <Text style={styles.featureTitle}>{f.title}</Text>
                                        <Text style={styles.featureDesc}>{f.desc}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.footerSpace} />
            </ScrollView>

            <View style={styles.fabContainer}>
                <Button
                    label="Nueva Transacción"
                    onPress={() => router.push('/(app)/transactions/new')}
                    leftIcon={<Ionicons name="add" size={24} color={theme.colors.white} />}
                    style={styles.fab}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { flex: 1 },
    summaryGrid: {
        padding: theme.spacing[16],
    },
    summaryCard: {
        padding: theme.spacing[20],
        backgroundColor: theme.colors.surface,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing[4],
    },
    summaryValue: {
        fontSize: theme.typography.sizes['3xl'],
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
    },
    welcomeContainer: {
        padding: theme.spacing[24],
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: theme.typography.sizes.xl,
        fontWeight: theme.typography.weights.bold,
        color: theme.colors.text,
        textAlign: 'center',
        marginTop: theme.spacing[16],
        marginBottom: theme.spacing[8],
    },
    welcomeDesc: {
        fontSize: theme.typography.sizes.base,
        color: theme.colors.textMuted,
        textAlign: 'center',
        marginBottom: theme.spacing[32],
    },
    featureList: {
        width: '100%',
        gap: theme.spacing[20],
    },
    featureListTitle: {
        fontSize: theme.typography.sizes.lg,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing[12],
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[16],
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.medium,
        color: theme.colors.text,
    },
    featureDesc: {
        fontSize: theme.typography.sizes.sm,
        color: theme.colors.textLight,
    },
    fabContainer: {
        position: 'absolute',
        bottom: theme.spacing[24],
        left: theme.spacing[16],
        right: theme.spacing[16],
    },
    fab: {
        borderRadius: theme.borderRadius.full,
        height: 56,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    footerSpace: {
        height: 100,
    }
});
