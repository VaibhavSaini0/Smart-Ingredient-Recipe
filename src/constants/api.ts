const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

const DEV_FALLBACK = 'http://localhost:3000';

export const API_BASE_URL = envUrl || (__DEV__ ? DEV_FALLBACK : '');

if (__DEV__) {
  console.log('[API]', API_BASE_URL);
  if (!envUrl) {
    console.warn('[API] EXPO_PUBLIC_API_URL not set — using localhost. Add it to .env for device testing.');
  }
}

if (!__DEV__ && !envUrl) {
  throw new Error('EXPO_PUBLIC_API_URL must be set for production builds.');
}

if (!__DEV__ && !API_BASE_URL.startsWith('https://')) {
  throw new Error('EXPO_PUBLIC_API_URL must use HTTPS in production.');
}
