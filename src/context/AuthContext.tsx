import React, { createContext, useContext, useMemo, useState } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error('Email and password are required.');
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    setUser({
      name: email.split('@')[0] || 'Chef',
      email: email.trim().toLowerCase(),
    });
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      throw new Error('All fields are required.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
    setIsLoading(false);
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, isLoading, login, signup, logout }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
