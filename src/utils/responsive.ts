import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Based on iPhone 11 Pro dimensions (375x812)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  
  if (Platform.OS === 'ios') {
    return (adjustedWidth >= 1000 || adjustedHeight >= 1000);
  }
  
  return (adjustedWidth >= 960 || adjustedHeight >= 960);
};

export const isSmallScreen = () => {
  return SCREEN_WIDTH < 375;
};

export const isLargeScreen = () => {
  return SCREEN_WIDTH > 414;
};

// Scale size based on screen width
export const scaleSize = (size: number): number => {
  if (isTablet()) {
    return size * 1.3;
  }
  
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  // Minimum and maximum scaling
  return Math.max(size * 0.8, Math.min(newSize, size * 1.4));
};

// Scale font size
export const scaleFontSize = (size: number): number => {
  if (isTablet()) {
    return size * 1.2;
  }
  
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  // More conservative scaling for fonts
  return Math.max(size * 0.9, Math.min(newSize, size * 1.2));
};

// Get responsive padding/margin
export const getSpacing = (base: number): number => {
  if (isTablet()) {
    return base * 1.5;
  }
  
  if (isSmallScreen()) {
    return base * 0.8;
  }
  
  if (isLargeScreen()) {
    return base * 1.1;
  }
  
  return base;
};

// Platform-specific values
export const platformValue = <T>(ios: T, android: T): T => {
  return Platform.select({ ios, android }) as T;
};

// Safe area helpers
export const getSafeAreaPadding = () => {
  if (Platform.OS === 'ios') {
    // For devices with notch
    if (SCREEN_HEIGHT >= 812) {
      return { top: 44, bottom: 34 };
    }
    // For older devices
    return { top: 20, bottom: 0 };
  }
  
  // Android
  return { top: 24, bottom: 0 };
};

// Device type detection
export const getDeviceType = () => {
  if (isTablet()) return 'tablet';
  if (isSmallScreen()) return 'small';
  if (isLargeScreen()) return 'large';
  return 'normal';
};

// Responsive styles helper
export const createResponsiveStyles = (styles: any) => {
  const deviceType = getDeviceType();
  
  return {
    ...styles,
    ...(styles[deviceType] || {}),
    ...(Platform.OS === 'ios' ? styles.ios : styles.android),
  };
};

// Card dimensions based on screen size
export const getCardDimensions = () => {
  const cardWidth = Math.min(SCREEN_WIDTH - 40, 350);
  const cardHeight = cardWidth * 0.63; // Standard card ratio
  
  return { width: cardWidth, height: cardHeight };
};

export const DEVICE_INFO = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isTablet: isTablet(),
  isSmallScreen: isSmallScreen(),
  isLargeScreen: isLargeScreen(),
  platform: Platform.OS,
  deviceType: getDeviceType(),
};