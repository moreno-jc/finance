import { Category } from '@/types/app';
import { theme } from './theme';

export const defaultCategories: Omit<Category, 'id' | 'user_id' | 'created_at'>[] = [
    // Gastos
    { name: 'Alimentación', type: 'expense', icon: 'fast-food-outline', color: theme.colors.types.expense, is_default: true },
    { name: 'Transporte', type: 'expense', icon: 'car-outline', color: theme.colors.types.expense, is_default: true },
    { name: 'Vivienda', type: 'expense', icon: 'home-outline', color: theme.colors.types.expense, is_default: true },
    { name: 'Servicios', type: 'expense', icon: 'flash-outline', color: theme.colors.types.expense, is_default: true },
    { name: 'Entretenimiento', type: 'expense', icon: 'game-controller-outline', color: theme.colors.types.expense, is_default: true },
    { name: 'Salud', type: 'expense', icon: 'medkit-outline', color: theme.colors.types.expense, is_default: true },

    // Ingresos
    { name: 'Salario', type: 'income', icon: 'cash-outline', color: theme.colors.types.income, is_default: true },
    { name: 'Negocios', type: 'income', icon: 'briefcase-outline', color: theme.colors.types.income, is_default: true },

    // Ahorro
    { name: 'Fondo Emergencia', type: 'saving', icon: 'shield-checkmark-outline', color: theme.colors.types.saving, is_default: true },

    // Inversión
    { name: 'Acciones', type: 'investment', icon: 'trending-up-outline', color: theme.colors.types.investment, is_default: true },

    // Deudas
    { name: 'Tarjeta Crédito', type: 'debt', icon: 'card-outline', color: theme.colors.types.debt, is_default: true },
    { name: 'Préstamo', type: 'debt', icon: 'wallet-outline', color: theme.colors.types.debt, is_default: true },
];
