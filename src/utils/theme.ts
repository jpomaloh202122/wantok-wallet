import { Platform } from 'react-native';
import { scaleFontSize, getSpacing, platformValue } from './responsive';

export const Colors = {
  // Primary colors - Golden bird theme
  primary: '#F4C430',        // Golden yellow
  primaryDark: '#DAA520',    // Darker gold
  primaryLight: '#FFE135',   // Bright gold
  secondary: '#FFA500',      // Orange gold
  accent: '#FFD700',         // Pure gold
  
  // System colors
  background: '#1A1A1A',     // Dark charcoal like logo background
  backgroundLight: '#F8F6F0', // Light cream for contrast
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text colors
  text: '#1A1A1A',           // Dark charcoal
  textOnDark: '#FFFFFF',     // White text on dark backgrounds
  textSecondary: '#8B7355',  // Muted gold-brown
  textTertiary: '#C4A676',   // Light gold-brown
  
  // Status colors
  success: '#228B22',        // Forest green
  warning: '#FF8C00',        // Dark orange
  error: '#DC143C',          // Crimson
  info: '#F4C430',           // Golden yellow (brand color)
  
  // Semantic colors
  border: '#E5D5B7',         // Light gold border
  separator: '#E5D5B7',
  shadow: '#000000',
  
  // Gradient colors for premium feel
  gradientStart: '#FFE135',   // Bright gold
  gradientEnd: '#DAA520',     // Dark gold
  
  // Platform-specific colors
  ios: {
    tabBarBackground: 'rgba(248, 246, 240, 0.95)', // Light cream with transparency
    tabBarBorder: 'rgba(196, 166, 118, 0.3)',      // Muted gold border
  },
  android: {
    tabBarBackground: '#F8F6F0',  // Light cream
    tabBarBorder: '#E5D5B7',      // Light gold border
  },
};

export const Typography = {
  // Font families
  fontFamily: {
    regular: platformValue('System', 'Roboto'),
    medium: platformValue('System', 'Roboto-Medium'),
    bold: platformValue('System', 'Roboto-Bold'),
    monospace: platformValue('Menlo', 'monospace'),
  },
  
  // Font sizes
  fontSize: {
    xs: scaleFontSize(12),
    sm: scaleFontSize(14),
    base: scaleFontSize(16),
    lg: scaleFontSize(18),
    xl: scaleFontSize(20),
    '2xl': scaleFontSize(24),
    '3xl': scaleFontSize(28),
    '4xl': scaleFontSize(32),
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = {
  xs: getSpacing(4),
  sm: getSpacing(8),
  md: getSpacing(12),
  lg: getSpacing(16),
  xl: getSpacing(20),
  '2xl': getSpacing(24),
  '3xl': getSpacing(32),
  '4xl': getSpacing(40),
  '5xl': getSpacing(48),
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
};

// Platform-specific button styles
export const ButtonStyles = {
  primary: {
    backgroundColor: Colors.primary,
    borderRadius: platformValue(BorderRadius.lg, BorderRadius.md),
    paddingVertical: platformValue(Spacing.md, Spacing.sm),
    paddingHorizontal: Spacing.xl,
    ...Shadows.md,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: platformValue(BorderRadius.lg, BorderRadius.md),
    paddingVertical: platformValue(Spacing.md, Spacing.sm),
    paddingHorizontal: Spacing.xl,
  },
  gradient: {
    borderRadius: platformValue(BorderRadius.lg, BorderRadius.md),
    paddingVertical: platformValue(Spacing.md, Spacing.sm),
    paddingHorizontal: Spacing.xl,
    ...Shadows.lg,
  },
};

// Card styles
export const CardStyles = {
  default: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  elevated: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
};

// Input styles
export const InputStyles = {
  container: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: platformValue(Spacing.md, Spacing.sm),
  },
  focused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: Colors.error,
    borderWidth: 1,
  },
};

// Tab bar styles
export const TabBarStyles = {
  container: {
    backgroundColor: platformValue(
      Colors.ios.tabBarBackground,
      Colors.android.tabBarBackground
    ),
    borderTopWidth: platformValue(0, 1),
    borderTopColor: platformValue(
      Colors.ios.tabBarBorder,
      Colors.android.tabBarBorder
    ),
    paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    height: platformValue(83, 60),
  },
};

export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  buttons: ButtonStyles,
  cards: CardStyles,
  inputs: InputStyles,
  tabBar: TabBarStyles,
};