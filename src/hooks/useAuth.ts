import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useCallback, useState } from 'react';

export function useAuth() {
    const { user, profile, session, isLoading, isInitialized, logout: storeLogout } = useAuthStore();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const login = useCallback(async (email: string, pass: string) => {
        setError(null);
        setIsSubmitting(true);

        if (!email || !pass) {
            setError('Por favor llena todos los campos');
            setIsSubmitting(false);
            return { error: 'Campos vacíos' };
        }

        const { error: signInError } = await authService.signIn(email, pass);

        if (signInError) {
            let customError = 'Ocurrió un error al iniciar sesión';
            if ((signInError as any).message?.includes('Invalid login credentials')) {
                customError = 'Email o contraseña incorrectos';
            }
            setError(customError);
            setIsSubmitting(false);
            return { error: customError };
        }

        setIsSubmitting(false);
        return { error: null };
    }, []);

    const register = useCallback(async (email: string, pass: string, fullName: string) => {
        setError(null);
        setIsSubmitting(true);

        if (!email || !pass || !fullName) {
            setError('Por favor llena todos los campos');
            setIsSubmitting(false);
            return { error: 'Campos vacíos' };
        }

        const { error: signUpError } = await authService.signUp(email, pass, fullName);

        if (signUpError) {
            let customError = 'Ocurrió un error al crear la cuenta';
            if ((signUpError as any).message?.includes('already registered')) {
                customError = 'El email ya está registrado';
            } else if ((signUpError as any).message?.includes('Password should be at least')) {
                customError = 'La contraseña es muy corta (mínimo 6 caracteres)';
            }
            setError(customError);
            setIsSubmitting(false);
            return { error: customError };
        }

        setIsSubmitting(false);
        return { error: null };
    }, []);

    return {
        user,
        profile,
        session,
        isLoading: isLoading || isSubmitting,
        isInitialized,
        error,
        login,
        register,
        logout: storeLogout,
    };
}
