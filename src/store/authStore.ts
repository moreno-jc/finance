import { authService } from '@/services/authService';
import { Profile } from '@/types/app';
import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setProfile: (profile: Profile | null) => void;
    setSession: (session: Session | null) => void;
    setLoading: (loading: boolean) => void;
    setInitialized: (initialized: boolean) => void;
    initialize: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isInitialized: false,

    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setSession: (session) => set({ session }),
    setLoading: (isLoading) => set({ isLoading }),
    setInitialized: (isInitialized) => set({ isInitialized }),

    initialize: async () => {
        try {
            set({ isLoading: true });

            const resp = await authService.getSession();
            const session = resp.data?.session;

            if (session?.user) {
                set({ session, user: session.user });
                const { data: profile } = await authService.getProfile(session.user.id);
                if (profile) set({ profile });
            }

        } catch (error) {
            console.error('Error initializing auth', error);
        } finally {
            set({ isLoading: false, isInitialized: true });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        await authService.signOut();
        set({ user: null, profile: null, session: null, isLoading: false });
    }
}));
