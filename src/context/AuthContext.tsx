'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'donor' | 'recipient' | 'ngo' | 'admin';
  avatar_url?: string;
  organization_name?: string;
  address?: string;
  phone?: string;
  city?: string;
  state?: string;
  is_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: 'donor' | 'recipient' | 'ngo' | 'admin';
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  switchRole: (role: 'donor' | 'recipient' | 'ngo' | 'admin') => void;
  openAuthModal: (initialTab?: 'signin' | 'signup' | 'forgot' | 'profile') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup' | 'forgot' | 'profile';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'donor' | 'recipient' | 'ngo' | 'admin'>('donor');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup' | 'forgot' | 'profile'>('signin');

  // Load session from /api/auth/me on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setRole(data.user.role);
          setIsAuthenticated(true);
        } else if (data.user) {
          // Initial baseline user
          setUser(data.user);
          setRole(data.user.role);
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        // Fallback default donor profile
        setUser({
          id: 'usr-donor-01',
          email: 'donor@artisanbakery.com',
          full_name: 'Artisan Kitchen & Bakery',
          role: 'donor',
          organization_name: 'Le Matin Boulangerie',
          avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
          is_verified: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed.' };
      }
      setUser(data.user);
      setRole(data.user.role);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed.' };
      }
      setUser(data.user);
      setRole(data.user.role);
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Non-blocking
    }
    setIsAuthenticated(false);
    setUser(null);
    setIsAuthModalOpen(false);
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to dispatch reset.' };
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const resetPassword = async (email: string, newPassword: string) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to reset password.' };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, ...updates }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to update profile.' };
      setUser((prev) => (prev ? { ...prev, ...data.user } : data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error.' };
    }
  };

  const switchRole = (newRole: 'donor' | 'recipient' | 'ngo' | 'admin') => {
    setRole(newRole);
    if (user) {
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const openAuthModal = (initialTab: 'signin' | 'signup' | 'forgot' | 'profile' = 'signin') => {
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        switchRole,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
