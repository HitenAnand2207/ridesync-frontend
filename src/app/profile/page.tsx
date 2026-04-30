'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Phone, Shield, Send, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [telegramLink, setTelegramLink] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loadingTelegram, setLoadingTelegram] = useState(false);
  const [connectCode, setConnectCode] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  const handleConnectTelegram = async () => {
    setLoadingTelegram(true);
    try {
      const res = await api.get('/auth/telegram-link');

      // Expecting backend to send BOTH code + link
      setConnectCode(res.data.code);
      setTelegramLink(res.data.link);
    } catch {
      toast.error('Failed to generate connect code');
    } finally {
      setLoadingTelegram(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    try {
      await api.delete('/auth/telegram-disconnect');
      setConnected(false);
      setConnectCode(null);
      setTelegramLink(null);
      toast.success('Telegram disconnected');
    } catch {
      toast.error('Failed to disconnect');
    }
  };

  if (loading || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '36px',
        fontWeight: 400,
        color: 'var(--text-primary)',
        marginBottom: '28px',
        letterSpacing: '-0.02em',
      }}>
        Profile
      </h1>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>

        {/* Avatar header */}
        <div style={{
          padding: '32px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--accent)',
          }}>
            {user.name[0]}
          </div>

          <div>
            <div style={{ fontSize: '18px', fontWeight: 700 }}>
              {user.name}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              KIIT University student
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '24px 32px' }}>
          {[
            { icon: <User size={16} />, label: 'Full name', value: user.name },
            { icon: <Mail size={16} />, label: 'Email', value: user.email },
            ...(user.phone ? [{ icon: <Phone size={16} />, label: 'Phone', value: user.phone }] : []),
          ].map(({ icon, label, value }) => (
            <div key={label} style={{
              display: 'flex',
              gap: '14px',
              padding: '14px 16px',
              background: 'var(--bg-secondary)',
              borderRadius: '10px',
              marginBottom: '10px',
            }}>
              {icon}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</div>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{value}</div>
              </div>
            </div>
          ))}

          {/* Verified */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '10px',
            padding: '12px 16px',
            background: 'var(--accent-light)',
            borderRadius: '10px',
          }}>
            <Shield size={15} />
            <span style={{ fontSize: '13px', fontWeight: 500 }}>
              Verified KIIT student
            </span>
          </div>

          {/* Telegram Section */}
          <div style={{
            padding: '20px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
          }}>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <Send size={18} color="#0088cc" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  Telegram notifications
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Get instant alerts when someone joins your group
                </div>
              </div>
            </div>

            {connected ? (
              <div>
                <div style={{ color: '#16a34a', marginBottom: '12px' }}>
                  <CheckCircle size={14} /> Connected
                </div>

                <button onClick={handleDisconnectTelegram} style={{
                  width: '100%',
                  padding: '10px',
                  color: '#dc2626',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                }}>
                  <XCircle size={14} /> Disconnect
                </button>
              </div>
            ) : (
              !connectCode ? (
                <div>
                  <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                    Connect your Telegram to receive instant notifications.
                  </p>

                  <button
                    onClick={handleConnectTelegram}
                    disabled={loadingTelegram}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#0088cc',
                      color: '#fff',
                      borderRadius: '8px',
                    }}
                  >
                    <Send size={14} />
                    {loadingTelegram ? 'Generating code...' : 'Connect Telegram'}
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                    Open Telegram and send:
                  </p>

                  <div style={{
                    textAlign: 'center',
                    padding: '14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}>
                    <code style={{ fontSize: '18px', fontWeight: 700 }}>
                      /connect {connectCode}
                    </code>
                  </div>

                  <button onClick={() => {
                    setConnectCode(null);
                    setTelegramLink(null);
                  }}>
                    Get new code
                  </button>
                </div>
              )
            )}

          </div>
        </div>
      </div>
    </div>
  );
}