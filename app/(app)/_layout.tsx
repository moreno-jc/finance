import { TabBar } from '@/components/ui/TabBar';
import { Tabs } from 'expo-router';

export default function AppLayout() {
    return (
        <Tabs
            tabBar={(props: any) => <TabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
            <Tabs.Screen name="transactions" options={{ title: 'Transacciones' }} />
            <Tabs.Screen name="reports" options={{ title: 'Reportes' }} />
            <Tabs.Screen name="settings" options={{ title: 'Configuración' }} />
        </Tabs>
    );
}
