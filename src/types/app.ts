export type TransactionType = 'income' | 'expense' | 'saving' | 'investment' | 'debt';

export interface Profile {
    id: string; // uuid
    full_name: string | null;
    currency: string; // default 'MXN'
    created_at: string;
}

export interface Category {
    id: string; // uuid
    user_id?: string;
    name: string;
    type: TransactionType;
    icon: string;
    color: string;
    is_default: boolean;
}

export interface Transaction {
    id: string; // uuid
    user_id: string;
    category_id: string;
    amount: number;
    type: TransactionType;
    description: string | null;
    date: string; // ISO string
    is_recurring: boolean;
    recurrence: string | null;
    source: 'manual' | 'n8n_gmail';
    external_id: string | null;
    created_at: string;
}

export interface NotificationSetting {
    id: string;
    user_id: string;
    type: string;
    enabled: boolean;
    threshold: number | null;
}

export interface DashboardSummary {
    user_id: string;
    month: string; // format YYYY-MM
    income: number;
    expense: number;
    saving: number;
    investment: number;
    debt: number;
    net_balance: number;
}
