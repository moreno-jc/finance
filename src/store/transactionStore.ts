import { supabase } from '@/services/supabase';
import { Database } from '@/types/database';
import { create } from 'zustand';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

interface TransactionState {
    transactions: Transaction[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    fetchTransactions: (userId: string) => Promise<void>;
    fetchCategories: (userId: string) => Promise<void>;
    addTransaction: (transaction: TransactionInsert) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
    transactions: [],
    categories: [],
    loading: false,
    error: null,

    fetchTransactions: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select('*, categories(*)')
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
            // Fetch default categories (user_id is null) AND user categories
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .or(`user_id.eq.${userId},user_id.is.null`);

            if (error) throw error;
            set({ categories: data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },

    addTransaction: async (transaction: TransactionInsert) => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert(transaction)
                .select()
                .single();

            if (error) throw error;

            // Refetch or update local state
            const transactions = get().transactions;
            set({ transactions: [data as any, ...transactions], loading: false });
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
}));
