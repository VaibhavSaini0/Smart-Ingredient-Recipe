import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  getMeApi,
  loginApi,
  logoutApi,
  signupApi,
} from '../api/auth';
import { ApiError } from '../api/client';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toAuthError(error: unknown): Error {
  if (error instanceof ApiError) {
    return new Error(error.message);
  }
  if (error instanceof Error) {
    return error;
  }
  return new Error('Something went wrong. Please try again.');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    getMeApi()
      .then((restored) => setUser(restored))
      .catch(() => setUser(null))
      .finally(() => setIsBootstrapping(false));
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginApi(email.trim(), password);
      setUser(data.user);
    } catch (error) {
      throw toAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await signupApi(name.trim(), email.trim(), password);
      setUser(data.user);
    } catch (error) {
      throw toAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const value = { user, isLoading, isBootstrapping, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
