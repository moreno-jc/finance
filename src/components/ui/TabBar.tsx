import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
                if (route.name === 'index') iconName = isFocused ? 'home' : 'home-outline';
                else if (route.name === 'transactions') iconName = isFocused ? 'list' : 'list-outline';
                else if (route.name === 'reports') iconName = isFocused ? 'bar-chart' : 'bar-chart-outline';
                else if (route.name === 'settings') iconName = isFocused ? 'settings' : 'settings-outline';

                const color = isFocused ? theme.colors.primary : theme.colors.textLight;

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={(options as any).tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabItem}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={iconName} size={24} color={color} />
                        <Text style={[styles.tabLabel, { color }]}>
                            {label as string}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing[12],
        minHeight: 60,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: theme.typography.weights.medium,
    },
});
