import { Database } from '@/types/database';
import { supabase } from './supabase';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

/**
 * Create a new transaction
 */
export const createTransaction = async (transaction: TransactionInsert): Promise<Transaction> => {
    const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Update an existing transaction
 */
export const updateTransaction = async (id: string, updates: TransactionUpdate): Promise<Transaction> => {
    const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

/**
 * Get a single transaction by ID
 */
export const getTransactionById = async (id: string): Promise<Transaction> => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
};

/**
 * Get all transactions for a user
 */
export const getTransactions = async (userId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

    if (error) throw error;
    return data;
};

/**
 * Create a new category
 */
export const createCategory = async (category: CategoryInsert): Promise<Category> => {
    const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * Get all categories for a user (including defaults)
 */
export const getCategories = async (userId: string): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

    if (error) throw error;
    return data;
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

/**
 * Get transactions filtered by type and/or category
 */
export const getFilteredTransactions = async (
    userId: string,
    types?: string[],
    categories?: string[],
    startDate?: string,
    endDate?: string
): Promise<Transaction[]> => {
    let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

    if (types && types.length > 0) {
        query = query.in('type', types);
    }

    if (categories && categories.length > 0) {
        query = query.in('category_id', categories);
    }

    if (startDate) {
        query = query.gte('date', startDate);
    }

    if (endDate) {
        query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) throw error;
    return data;
};

/**
 * Search transactions by description or category name
 */
export const searchTransactions = async (userId: string, searchQuery: string): Promise<Transaction[]> => {
    // Search in description using ILIKE
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .ilike('description', `%${searchQuery}%`)
        .order('date', { ascending: false });

    if (error) throw error;
    return data;
};
