export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    avatar_url: string | null
                    currency: string
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    avatar_url?: string | null
                    currency?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    currency?: string
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    user_id: string | null
                    name: string
                    type: 'income' | 'expense' | 'saving' | 'investment' | 'debt'
                    icon: string
                    color: string
                    is_default: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    name: string
                    type: 'income' | 'expense' | 'saving' | 'investment' | 'debt'
                    icon: string
                    color: string
                    is_default?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    name?: string
                    type?: 'income' | 'expense' | 'saving' | 'investment' | 'debt'
                    icon?: string
                    color?: string
                    is_default?: boolean
                    created_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    category_id: string | null
                    amount: number
                    type: 'income' | 'expense' | 'saving' | 'investment' | 'debt'
                    description: string | null
                    date: string
                    is_recurring: boolean
                    recurrence: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
                    source: string
                    external_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    category_id?: string | null
                    amount: number
                    type: 'income' | 'expense' | 'saving' | 'investment' | 'debt'
                    description?: string | null
                    date?: string
                    is_recurring?: boolean
                    recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
                    source?: string
                    external_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category_id?: string | null
                    amount?: number
                    type?: 'income' | 'expense' | 'saving' | 'investment' | 'debt'
                    description?: string | null
                    date?: string
                    is_recurring?: boolean
                    recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
                    source?: string
                    external_id?: string | null
                    created_at?: string
                }
            }
            notification_settings: {
                Row: {
                    id: string
                    user_id: string
                    type: 'weekly_reminder' | 'expense_alert' | 'transaction_confirm'
                    enabled: boolean
                    threshold: number | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'weekly_reminder' | 'expense_alert' | 'transaction_confirm'
                    enabled?: boolean
                    threshold?: number | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'weekly_reminder' | 'expense_alert' | 'transaction_confirm'
                    enabled?: boolean
                    threshold?: number | null
                }
            }
            email_sync_log: {
                Row: {
                    id: string
                    user_id: string
                    gmail_message_id: string
                    parsed_transaction_id: string | null
                    status: 'success' | 'failed' | 'skipped'
                    raw_subject: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    gmail_message_id: string
                    parsed_transaction_id?: string | null
                    status: 'success' | 'failed' | 'skipped'
                    raw_subject?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    gmail_message_id?: string
                    parsed_transaction_id?: string | null
                    status?: 'success' | 'failed' | 'skipped'
                    raw_subject?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            dashboard_summary: {
                Row: {
                    user_id: string
                    month: string
                    income: number
                    expense: number
                    saving: number
                    investment: number
                    debt: number
                    net_balance: number
                }
            }
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
