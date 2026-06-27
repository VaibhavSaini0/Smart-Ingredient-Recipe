import { Platform, ViewStyle } from 'react-native';

export const colors = {
  primary: '#E85D04',
  primaryLight: '#FFF4E6',
  primaryBorder: '#FFD8A8',
  primaryGradientEnd: '#F48C06',
  primaryTrack: '#FFE8CC',
  secondary: '#2D6A4F',
  secondaryLight: '#E8F5E9',
  background: '#FFF8F0',
  surface: '#FFFFFF',
  muted: '#F3F4F6',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  error: '#DC2626',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  success: '#16A34A',
  successBg: '#ECFDF5',
  successBorder: '#A7F3D0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

function webShadow(boxShadow: string): ViewStyle {
  return Platform.OS === 'web' ? ({ boxShadow } as ViewStyle) : {};
}

function nativeShadow(
  shadowColor: string,
  offsetY: number,
  opacity: number,
  radius: number,
  elevation: number,
): ViewStyle {
  if (Platform.OS === 'web') return {};
  return {
    shadowColor,
    shadowOffset: { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}

export const shadows = {
  card: {
    ...webShadow('0px 4px 12px rgba(26, 26, 46, 0.08)'),
    ...nativeShadow('#1A1A2E', 4, 0.08, 12, 4),
  },
  bar: {
    ...webShadow('0px -2px 8px rgba(26, 26, 46, 0.12)'),
    ...nativeShadow('#1A1A2E', -2, 0.12, 8, 8),
  },
};
