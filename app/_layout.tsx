import { theme } from '@/constants/theme';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function RootLayout() {
  const { isInitialized, session, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    initialize();

    // Subscribe to auth changes
    const subscription = authService.onAuthStateChange(async (event, newSession) => {
      useAuthStore.getState().setSession(newSession);
      if (newSession?.user) {
        useAuthStore.getState().setUser(newSession.user);
        const { data: profile } = await authService.getProfile(newSession.user.id);
        if (profile) useAuthStore.getState().setProfile(profile);
      } else {
        useAuthStore.getState().setUser(null);
        useAuthStore.getState().setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(app)');
    }
  }, [session, isInitialized, segments]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(app)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
