'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = (focused: boolean) => ({
    position: 'relative' as const,
    borderRadius: '10px',
    border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border-input)'}`,
    background: 'var(--bg-card)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: focused ? '0 0 0 3px var(--accent-light)' : 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 14px',
  });

  const inputStyle = {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    background: 'transparent',
    fontSize: '15px',
    color: 'var(--text-primary)',
    outline: 'none',
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0',
      alignItems: 'stretch',
      margin: '0 -1.5rem',
    }}>
      {/* Left — branding panel */}
      <div style={{
        background: 'var(--accent)',
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '0 0 0 16px',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontStyle: 'italic',
            color: '#ffffff',
            marginBottom: '48px',
            letterSpacing: '-0.02em',
          }}>
            RideSync
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '44px',
            fontWeight: 400,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}>
            Share cabs.<br />
            <em style={{ color: '#bfdbfe' }}>Split the fare.</em>
          </h2>

          <p style={{
            fontSize: '16px',
            color: '#bfdbfe',
            lineHeight: 1.7,
            maxWidth: '360px',
          }}>
            Find people heading the same way and split the Ola or Uber fare effortlessly.
          </p>
        </div>

       
      </div>

      {/* Right — form */}
      <div style={{
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ maxWidth: '360px', width: '100%', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '36px' }}>
            Sign in to your RideSync account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                Email
              </label>
              <div style={inputWrap(focused === 'email')}>
                <Mail size={16} color={focused === 'email' ? 'var(--accent)' : 'var(--text-muted)'} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                Password
              </label>
              <div style={inputWrap(focused === 'password')}>
                <Lock size={16} color={focused === 'password' ? 'var(--accent)' : 'var(--text-muted)'} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'var(--text-muted)' : 'var(--accent)',
              color: '#ffffff', border: 'none',
              borderRadius: '10px', fontSize: '15px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              transition: 'background 0.15s',
            }}>
              {loading ? 'Signing in...' : (<>Sign in <ArrowRight size={17} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '24px' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
