import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface CategoryIconProps {
    icon: string;
    size?: number;
    color?: string;
}

export function CategoryIcon({ icon, size = 20, color = '#000' }: CategoryIconProps) {
    // Type-safely cast the icon string to a valid Ionicons glyph name
    // with fallback to 'help-circle-outline' if the icon name is invalid
    let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';
    
    if (icon && (Ionicons.glyphMap as any)[icon]) {
        iconName = icon as keyof typeof Ionicons.glyphMap;
    }

    return <Ionicons name={iconName} size={size} color={color} />;
}
