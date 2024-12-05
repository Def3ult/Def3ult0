import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/auth';
import { initDb } from '../lib/db';

interface AuthContextType {
  user: User;
  login: (userData: { id: number; username: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser
      ? JSON.parse(savedUser)
      : { id: null, username: '', isAuthenticated: false };
  });

  useEffect(() => {
    initDb().catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const login = (userData: { id: number; username: string }) => {
    setUser({ ...userData, isAuthenticated: true });
  };

  const logout = () => {
    setUser({ id: null, username: '', isAuthenticated: false });
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}