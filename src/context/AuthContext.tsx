import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types/database';
import { authService } from '../services/api';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isConfigured: boolean;
  login: (email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, name: string, role?: UserRole) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  switchMockRole: (role: UserRole) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const profile = await authService.getCurrentProfile();
      setUser(profile);
    } catch (e) {
      console.error('Error getting profile', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (session?.user) {
          refreshUser();
        }
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, pass: string, role?: UserRole) => {
    const res = await authService.login(email, pass, role);
    if (res.error) {
      return { success: false, error: res.error };
    }
    setUser(res.profile);
    return { success: true };
  };

  const signup = async (email: string, pass: string, name: string, role: UserRole = 'student') => {
    const res = await authService.signup(email, pass, name, role);
    if (res.error && !res.requiresEmailConfirmation) {
      return {
        success: false,
        error: res.error,
        requiresEmailConfirmation: false
      };
    }
    if (res.requiresEmailConfirmation) {
      return {
        success: false,
        error: res.error,
        requiresEmailConfirmation: true
      };
    }
    if (res.profile) {
      setUser(res.profile);
    }
    return { success: true };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchMockRole = (role: UserRole) => {
    // Role switching is strictly prohibited while logged in.
    // Users must sign out and authenticate via login/sign-in.
    if (user) {
      console.warn('Role switching is prohibited while logged in. Please sign out first.');
      return;
    }
    const updated = authService.switchMockUser(role);
    if (updated) {
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        isConfigured: isSupabaseConfigured,
        login,
        signup,
        logout,
        switchMockRole,
        refreshUser,
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
