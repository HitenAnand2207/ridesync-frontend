'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import api from '@/lib/axios';
import { reverseGeocodeCity } from '@/lib/location';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  userCity: string;
  setUserCity: (city: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const detectCity = async (): Promise<string> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(''); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const city = await reverseGeocodeCity(pos.coords.latitude, pos.coords.longitude);
          resolve(city);
        } catch { resolve(''); }
      },
      () => resolve('')
    );
  });
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userCity, setUserCityState] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    const storedCity = localStorage.getItem('userCity');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    if (storedCity) setUserCityState(storedCity);
    setLoading(false);
  }, []);

  const setUserCity = (city: string) => {
    setUserCityState(city);
    localStorage.setItem('userCity', city);
    api.patch('/auth/profile', { city }).catch(() => {});
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { accessToken, user } = res.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(accessToken);
    setUser(user);

    const savedCity = localStorage.getItem('userCity');
    if (!savedCity) {
      const city = await detectCity();
      if (city) {
        setUserCityState(city);
        localStorage.setItem('userCity', city);
        api.patch('/auth/profile', { city }).catch(() => {});
      }
    }
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, userCity, setUserCity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
