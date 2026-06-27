import { Platform } from 'react-native';

const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

function getDefaultDevUrl(): string {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }
  return 'http://localhost:3000';
}

export const API_BASE_URL = envUrl || getDefaultDevUrl();

if (__DEV__ && !envUrl) {
  console.warn(
    '[API] EXPO_PUBLIC_API_URL is not set. Using',
    API_BASE_URL,
    '— set it in .env for phone testing (use your PC LAN IP).',
  );
}

if (!__DEV__ && !envUrl) {
  throw new Error(
    'EXPO_PUBLIC_API_URL must be set for production builds.',
  );
}

if (!__DEV__ && !API_BASE_URL.startsWith('https://')) {
  throw new Error('EXPO_PUBLIC_API_URL must use HTTPS in production.');
}
