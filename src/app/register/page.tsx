'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Car, Mail, Lock, User, Phone } from 'lucide-react';
import api from '@/lib/axios';

const inputStyle = {
  width: '100%',
  padding: '10px 12px 10px 38px',
  borderRadius: '8px',
  border: '1px solid var(--border-input)',
  fontSize: '14px',
  color: 'var(--text-primary)',
  background: 'var(--bg-card)',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! Check your KIIT email for the OTP.');
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full name', type: 'text', placeholder: 'Hiten Anand', icon: <User size={15} color="var(--text-muted)" /> },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@kiit.ac.in', icon: <Mail size={15} color="var(--text-muted)" /> },
    { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '+91 98765 43210', icon: <Phone size={15} color="var(--text-muted)" /> },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: <Lock size={15} color="var(--text-muted)" /> },
  ];

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: 'var(--accent-light)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Car size={24} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Create your account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Join KIIT students on RideSync
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '32px',
        }}>
          <form onSubmit={handleSubmit}>
            {fields.map(({ key, label, type, placeholder, icon }) => (
              <div key={key} style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block', fontSize: '13px',
                  fontWeight: 500, color: 'var(--text-secondary)',
                  marginBottom: '6px',
                }}>
                  {label}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '12px',
                    top: '50%', transform: 'translateY(-50%)',
                  }}>
                    {icon}
                  </span>
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={inputStyle}
                    placeholder={placeholder}
                    required={key !== 'phone'}
                  />
                </div>
              </div>
            ))}

            <p style={{
              fontSize: '12px', color: 'var(--text-muted)',
              textAlign: 'center', marginBottom: '12px', marginTop: '4px',
            }}>
              Only <strong style={{ color: 'var(--text-secondary)' }}>@kiit.ac.in</strong> emails are accepted
            </p>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px',
                background: loading ? 'var(--text-muted)' : 'var(--accent)',
                color: '#ffffff', border: 'none',
                borderRadius: '8px', fontSize: '14px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '20px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}