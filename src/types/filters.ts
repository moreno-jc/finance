import { TransactionType } from './app';

export interface DateRange {
    start: string; // ISO date string
    end: string; // ISO date string
}

export interface TransactionFilters {
    types?: TransactionType[];
    categories?: string[]; // category IDs
    dateRange?: DateRange;
}

export type DateFilterPeriod = 'today' | 'week' | 'month' | 'custom';

export interface DateFilterState {
    period: DateFilterPeriod;
    customRange?: DateRange;
}

/**
 * Get date range for a given period (relative to today)
 */
export const getDateRangeForPeriod = (period: DateFilterPeriod, customRange?: DateRange): DateRange => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let start: Date;
    let end: Date;

    switch (period) {
        case 'today':
            start = new Date(today);
            end = new Date(today);
            break;
        case 'week':
            start = new Date(today);
            start.setDate(today.getDate() - today.getDay()); // Sunday
            end = new Date(today);
            break;
        case 'month':
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(today);
            break;
        case 'custom':
            if (!customRange) {
                return { start: today.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
            }
            return customRange;
        default:
            start = today;
            end = today;
    }

    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
};

/**
 * Group transactions by date with human-readable labels
 */
export const getDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
        return 'Hoy';
    }

    if (date.getTime() === yesterday.getTime()) {
        return 'Ayer';
    }

    return date.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
};

/**
 * Group transactions by date
 */
export interface GroupedTransactions {
    date: string;
    label: string;
    transactions: any[]; // Transaction[]
}

export const groupTransactionsByDate = (transactions: any[]): GroupedTransactions[] => {
    const groups: Record<string, any[]> = {};

    transactions.forEach(transaction => {
        const dateStr = transaction.date.split('T')[0];
        if (!groups[dateStr]) {
            groups[dateStr] = [];
        }
        groups[dateStr].push(transaction);
    });

    return Object.entries(groups)
        .map(([date, txns]) => ({
            date,
            label: getDateLabel(date),
            transactions: txns,
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
