import { supabase } from '@/services/supabase';
import { Database } from '@/types/database';
import { GroupedTransactions, groupTransactionsByDate, TransactionFilters } from '@/types/filters';
import { create } from 'zustand';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

interface MonthStats {
    income: number;
    expense: number;
    debt: number;
    balance: number;
}

interface MonthComparison {
    currentMonth: MonthStats;
    previousMonth: MonthStats;
    percentageChange: number;
}

interface TransactionState {
    transactions: Transaction[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    activeFilters: TransactionFilters;
    
    // Fetch operations
    fetchTransactions: (userId: string) => Promise<void>;
    fetchCategories: (userId: string) => Promise<void>;
    
    // Transaction CRUD
    addTransaction: (transaction: TransactionInsert) => Promise<void>;
    updateTransaction: (id: string, updates: TransactionUpdate) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    
    // Category operations
    addCategory: (category: CategoryInsert) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    
    // Search and filters
    setSearchQuery: (query: string) => void;
    setActiveFilters: (filters: TransactionFilters) => void;
    clearFilters: () => void;
    
    // Getters
    getCurrentMonthStats: () => MonthStats;
    getPreviousMonthStats: () => MonthStats;
    getMonthComparison: () => MonthComparison;
    getRecentTransactions: (limit?: number) => Transaction[];
    getFilteredAndSearchedTransactions: () => Transaction[];
    getGroupedTransactions: () => GroupedTransactions[];
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    categories: [],
    loading: false,
    error: null,
    searchQuery: '',
    activeFilters: {},

    // ===== Fetch Operations =====
    fetchTransactions: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) throw error;
            set({ transactions: data as any, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    fetchCategories: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .or(`user_id.eq.${userId},user_id.is.null`)
                .order('is_default', { ascending: false })
                .order('name', { ascending: true });

            if (error) throw error;
            set({ categories: data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    // ===== Transaction CRUD =====
    addTransaction: async (transaction: TransactionInsert) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert(transaction)
                .select()
                .single();

            if (error) throw error;

            const transactions = get().transactions;
            set({ transactions: [data as any, ...transactions], loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    updateTransaction: async (id: string, updates: TransactionUpdate) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('transactions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            const transactions = get().transactions.map(t => t.id === id ? (data as any) : t);
            set({ transactions, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    deleteTransaction: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            const transactions = get().transactions.filter(t => t.id !== id);
            set({ transactions, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    // ===== Category Operations =====
    addCategory: async (category: CategoryInsert) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert(category)
                .select()
                .single();

            if (error) throw error;

            const categories = get().categories;
            set({ categories: [...categories, data], loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    deleteCategory: async (id: string) => {
        set({ loading: true, error: null });
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            const categories = get().categories.filter(c => c.id !== id);
            set({ categories, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    // ===== Search and Filters =====
    setSearchQuery: (query: string) => {
        set({ searchQuery: query });
    },

    setActiveFilters: (filters: TransactionFilters) => {
        set({ activeFilters: filters });
    },

    clearFilters: () => {
        set({ searchQuery: '', activeFilters: {} });
    },

    // ===== Getters =====
    getMonthStats: (year: number, month: number): MonthStats => {
        const transactions = get().transactions;
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;

        const monthTransactions = transactions.filter(t => t.date.startsWith(monthStr));
        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + Number(t.amount), 0);
        const expense = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + Number(t.amount), 0);
        const debt = monthTransactions
            .filter(t => t.type === 'debt')
            .reduce((acc, t) => acc + Number(t.amount), 0);
        const balance = income - expense - debt;

        return { income, expense, debt, balance };
    },

    getCurrentMonthStats: () => {
        const now = new Date();
        return (get() as any).getMonthStats(now.getFullYear(), now.getMonth() + 1);
    },

    getPreviousMonthStats: () => {
        const now = new Date();
        const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return (get() as any).getMonthStats(prevDate.getFullYear(), prevDate.getMonth() + 1);
    },

    getMonthComparison: () => {
        const currentMonth = (get() as any).getCurrentMonthStats();
        const previousMonth = (get() as any).getPreviousMonthStats();
        
        const percentageChange = previousMonth.income !== 0
            ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100
            : 0;

        return { currentMonth, previousMonth, percentageChange };
    },

    getRecentTransactions: (limit: number = 10) => {
        return get().transactions.slice(0, limit);
    },

    // Filter and search combined
    getFilteredAndSearchedTransactions: () => {
        let filtered = [...get().transactions];
        const { activeFilters, searchQuery, categories } = get();

        // Apply type filter
        if (activeFilters.types && activeFilters.types.length > 0) {
            filtered = filtered.filter(t => activeFilters.types!.includes(t.type as any));
        }

        // Apply category filter
        if (activeFilters.categories && activeFilters.categories.length > 0) {
            filtered = filtered.filter(t => activeFilters.categories!.includes(t.category_id || ''));
        }

        // Apply date range filter
        if (activeFilters.dateRange) {
            const { start, end } = activeFilters.dateRange;
            filtered = filtered.filter(t => {
                const txDate = t.date.split('T')[0];
                return txDate >= start && txDate <= end;
            });
        }

        // Apply search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t => {
                const desc = (t.description || '').toLowerCase();
                const category = categories.find(c => c.id === t.category_id);
                const catName = (category?.name || '').toLowerCase();
                return desc.includes(query) || catName.includes(query);
            });
        }

        return filtered;
    },

    getGroupedTransactions: () => {
        const filtered = (get() as any).getFilteredAndSearchedTransactions();
        return groupTransactionsByDate(filtered);
    },
}));
