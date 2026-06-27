import { apiRequest, hasAuthToken, setToken, ApiError } from './client';

interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

interface MeResponse {
  user: { id: string; name: string; email: string };
}

export async function signupApi(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  await setToken(data.token);
  return data;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  await setToken(data.token);
  return data;
}

export async function logoutApi(): Promise<void> {
  await setToken(null);
}

export async function getMeApi(): Promise<MeResponse['user'] | null> {
  const token = await hasAuthToken();
  if (!token) return null;

  try {
    const data = await apiRequest<MeResponse>('/api/auth/me');
    return data.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await setToken(null);
      return null;
    }
    throw error;
  }
}
