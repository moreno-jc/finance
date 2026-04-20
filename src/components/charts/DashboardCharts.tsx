import { Card } from '@/components/ui/Card';
import { theme } from '@/constants/theme';
import { useTransactionStore } from '@/store/transactionStore';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';

export function DashboardCharts() {
    const { transactions, categories } = useTransactionStore();

    // Data for Expenses Pie Chart
    const pieData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const categoryTotals: Record<string, number> = {};

        expenses.forEach(t => {
            if (t.category_id) {
                categoryTotals[t.category_id] = (categoryTotals[t.category_id] || 0) + Number(t.amount);
            }
        });

        return Object.entries(categoryTotals).map(([catId, total]) => {
            const category = categories.find(c => c.id === catId);
            return {
                value: total,
                color: category?.color || theme.colors.primary,
                text: category?.name || 'Desconocido',
                label: category?.name || 'Desconocido',
            };
        }).sort((a, b) => b.value - a.value).slice(0, 5);
    }, [transactions, categories]);

    // Data for Income vs Expense Bar Chart (last 6 months)
    const barData = useMemo(() => {
        const result: any[] = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStr = d.toISOString().substring(0, 7); // YYYY-MM

            const monthTransactions = transactions.filter(t => t.date.startsWith(monthStr));
            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((acc, t) => acc + Number(t.amount), 0);
            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((acc, t) => acc + Number(t.amount), 0);

            result.push({
                value: income,
                label: d.toLocaleString('es-ES', { month: 'short' }),
                spacing: 2,
                labelWidth: 30,
                labelTextStyle: { color: theme.colors.textMuted, fontSize: 10 },
                frontColor: theme.colors.success,
            });
            result.push({
                value: expense,
                frontColor: theme.colors.error,
            });
        }
        return result;
    }, [transactions]);

    if (transactions.length === 0) return null;

    return (
        <View style={styles.container}>
            <Card style={styles.chartCard}>
                <Text style={styles.chartTitle}>Gastos por Categoría</Text>
                <View style={styles.pieContainer}>
                    <PieChart
                        data={pieData}
                        donut
                        radius={80}
                        innerRadius={50}
                        focusOnPress
                        showText
                        textColor={theme.colors.white}
                        textSize={10}
                        innerCircleColor={theme.colors.white}
                    />
                    <View style={styles.legendContainer}>
                        {pieData.map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                                <Text style={styles.legendText}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Card>

            <Card style={styles.chartCard}>
                <Text style={styles.chartTitle}>Ingresos vs Gastos</Text>
                <BarChart
                    data={barData}
                    barWidth={16}
                    noOfSections={3}
                    barBorderRadius={4}
                    frontColor="lightgray"
                    yAxisThickness={0}
                    xAxisThickness={0}
                    hideRules
                    yAxisTextStyle={{ color: theme.colors.textMuted, fontSize: 10 }}
                    maxValue={Math.max(...barData.map(d => d.value)) * 1.2 || 1000}
                />
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: theme.spacing[16],
        paddingHorizontal: theme.spacing[16],
    },
    chartCard: {
        padding: theme.spacing[16],
    },
    chartTitle: {
        fontSize: theme.typography.sizes.base,
        fontWeight: theme.typography.weights.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing[16],
        textAlign: 'center',
    },
    pieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing[16],
    },
    legendContainer: {
        flexDirection: 'column',
        gap: theme.spacing[8],
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[4],
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendText: {
        fontSize: theme.typography.sizes.xs,
        color: theme.colors.textMuted,
    },
});
