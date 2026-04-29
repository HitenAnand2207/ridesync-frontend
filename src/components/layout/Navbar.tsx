'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { Car, LogOut, User, Plus, Search, BookOpen, Sun, Moon, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  const isActive = (path: string) => pathname.startsWith(path);

  const navLink = (href: string, icon: React.ReactNode, label: string) => (
    <Link key={href} href={href} style={{
      display: 'flex', alignItems: 'center', gap: '5px',
      padding: '6px 13px', borderRadius: '8px',
      fontSize: '14px', fontWeight: 500,
      color: isActive(href) ? 'var(--accent)' : 'var(--text-secondary)',
      background: isActive(href) ? 'var(--accent-light)' : 'transparent',
      textDecoration: 'none', transition: 'all 0.15s',
    }}>
      {icon}{label}
    </Link>
  );

  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem',
        height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontFamily: 'var(--font-display)',
          fontSize: '22px', fontStyle: 'italic',
          color: 'var(--text-primary)', textDecoration: 'none',
        }}>
          <Car size={20} color="var(--accent)" />
          RideSync
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {user && (
            <>
              {navLink('/board', <Zap size={14} />, 'Live board')}
              {navLink('/groups/search', <Search size={14} />, 'Find group')}
              {navLink('/groups/create', <Plus size={14} />, 'Start group')}
              {navLink('/memberships', <BookOpen size={14} />, 'My groups')}
              {navLink('/profile', <User size={14} />, user.name.split(' ')[0])}
              <button onClick={handleLogout} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 13px', borderRadius: '8px', fontSize: '14px',
                fontWeight: 500, color: '#dc2626', background: 'transparent',
                border: 'none', cursor: 'pointer',
              }}>
                <LogOut size={14} /> Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link href="/login" style={{
                padding: '7px 16px', borderRadius: '8px', fontSize: '14px',
                fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none',
              }}>Login</Link>
              <Link href="/register" style={{
                padding: '7px 16px', borderRadius: '8px', fontSize: '14px',
                fontWeight: 600, color: '#ffffff', background: 'var(--accent)', textDecoration: 'none',
              }}>Sign up</Link>
            </>
          )}
          <button onClick={toggleTheme} style={{
            marginLeft: '8px', padding: '7px', borderRadius: '8px',
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
}