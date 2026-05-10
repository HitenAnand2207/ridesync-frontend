'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, ArrowRight, Shield } from 'lucide-react';
import api from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! Check your email for the OTP.');
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputWrap = (isFocused: boolean) => ({
    position: 'relative' as const,
    borderRadius: '10px',
    border: `1.5px solid ${isFocused ? 'var(--accent)' : 'var(--border-input)'}`,
    background: 'var(--bg-card)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxShadow: isFocused ? '0 0 0 3px var(--accent-light)' : 'none',
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

  const fields = [
    { key: 'name', label: 'Full name', type: 'text', placeholder: 'Hiten Anand', icon: User },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: Mail },
    { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+91 98765 43210', icon: Phone },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: Lock },
  ];

  return (
    <div style={{
      minHeight: '85vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0',
      alignItems: 'stretch',
      margin: '0 -1.5rem',
    }}>
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
            fontSize: '28px', fontStyle: 'italic',
            color: '#ffffff', marginBottom: '48px',
            letterSpacing: '-0.02em',
          }}>
            RideSync
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '44px', fontWeight: 400,
            color: '#ffffff', lineHeight: 1.15,
            marginBottom: '20px', letterSpacing: '-0.02em',
          }}>
            Share cabs<br />
            <em style={{ color: '#bfdbfe' }}>across India.</em>
          </h2>

          <p style={{ fontSize: '16px', color: '#bfdbfe', lineHeight: 1.7, maxWidth: '360px' }}>
            Stop overpaying for solo cabs. Find people heading your way, split the fare, and travel smarter.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { emoji: '💸', text: 'Save up to 75% on cab fares' },
            { emoji: '📱', text: 'Coordinate via Telegram instantly' },
            { emoji: '🔒', text: 'Verified users only' },
          ].map(({ emoji, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '10px', padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              <span style={{ fontSize: '20px' }}>{emoji}</span>
              <span style={{ fontSize: '14px', color: '#e0e7ff', fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

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
            fontSize: '32px', fontWeight: 400,
            color: 'var(--text-primary)', marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}>
            Create account
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Join RideSync and start sharing cabs.
          </p>

          <form onSubmit={handleSubmit}>
            {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '7px' }}>
                  {label}
                </label>
                <div style={inputWrap(focused === key)}>
                  <Icon size={16} color={focused === key ? 'var(--accent)' : 'var(--text-muted)'} />
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused(null)}
                    style={inputStyle}
                    placeholder={placeholder}
                    required={key !== 'phone'}
                  />
                </div>
              </div>
            ))}

            <div style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '10px 12px', background: 'var(--accent-light)',
              borderRadius: '8px', marginBottom: '20px',
              fontSize: '12px', color: 'var(--accent-text)',
            }}>
              <Shield size={13} />
              A verification code will be sent to your email
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? 'var(--text-muted)' : 'var(--accent)',
              color: '#ffffff', border: 'none',
              borderRadius: '10px', fontSize: '15px', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
            }}>
              {loading ? 'Creating account...' : (<>Create account <ArrowRight size={17} /></>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}