'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  if (loading || !user) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading...</div>
  );

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '36px', fontWeight: 400,
        color: 'var(--text-primary)', marginBottom: '28px',
        letterSpacing: '-0.02em',
      }}>
        Profile
      </h1>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        {/* Avatar header */}
        <div style={{
          padding: '32px', background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'var(--accent-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 700, color: 'var(--accent)',
            flexShrink: 0,
          }}>
            {user.name[0]}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              KIIT University student
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '24px 32px' }}>
          {[
            { icon: <User size={16} color="var(--accent)" />, label: 'Full name', value: user.name },
            { icon: <Mail size={16} color="var(--accent)" />, label: 'Email', value: user.email },
            ...(user.phone ? [{ icon: <Phone size={16} color="var(--accent)" />, label: 'Phone', value: user.phone }] : []),
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '14px 16px', background: 'var(--bg-secondary)',
              borderRadius: '10px', marginBottom: '10px',
            }}>
              {icon}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</div>
              </div>
            </div>
          ))}

          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginTop: '16px', padding: '12px 16px',
            background: 'var(--accent-light)', borderRadius: '10px',
          }}>
            <Shield size={15} color="var(--accent)" />
            <span style={{ fontSize: '13px', color: 'var(--accent-text)', fontWeight: 500 }}>
              Verified KIIT student
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}