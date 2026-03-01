import { Profile } from '@/types/app';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export const authService = {
    async signUp(email: string, password: string, fullName: string) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });
            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    },

    async signIn(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    },

    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (error) {
            return { error };
        }
    },

    async getSession() {
        try {
            const { data, error } = await supabase.auth.getSession();
            return { data, error };
        } catch (error) {
            return { data: null, error };
        }
    },

    onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
        const { data } = supabase.auth.onAuthStateChange(callback);
        return data.subscription;
    },

    async getProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            return { data: data as Profile | null, error };
        } catch (error) {
            return { data: null, error };
        }
    },
};
