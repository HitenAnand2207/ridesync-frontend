'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Phone, Shield, Send, CheckCircle, XCircle, MapPin } from 'lucide-react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { reverseGeocodeCity } from '@/lib/location';

export default function ProfilePage() {
  const { user, loading, userCity, setUserCity } = useAuth();
  const router = useRouter();
  const [connectCode, setConnectCode] = useState<string | null>(null);
  const [telegramLink, setTelegramLink] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loadingTelegram, setLoadingTelegram] = useState(false);
  const [editingCity, setEditingCity] = useState(false);
  const [newCity, setNewCity] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  const handleConnectTelegram = async () => {
    setLoadingTelegram(true);
    try {
      const res = await api.get('/auth/telegram-link');
      setConnectCode(res.data.code);
      setTelegramLink(res.data.link);
    } catch {
      toast.error('Failed to get connect code');
    } finally {
      setLoadingTelegram(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    try {
      await api.delete('/auth/telegram-disconnect');
      setConnected(false);
      toast.success('Telegram disconnected');
    } catch {
      toast.error('Failed to disconnect');
    }
  };

  const handleSaveCity = () => {
    if (!newCity.trim()) { toast.error('Please enter a city'); return; }
    setUserCity(newCity.trim());
    setEditingCity(false);
    toast.success(`City updated to ${newCity.trim()}`);
  };

  const handleDetectCity = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    const loadingToast = toast.loading('Detecting location...');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const city = await reverseGeocodeCity(pos.coords.latitude, pos.coords.longitude);
          toast.dismiss(loadingToast);
          if (city) {
            setNewCity(city);
            toast.success(`Detected: ${city}`);
          } else {
            toast.error('Could not detect city');
          }
        } catch {
          toast.dismiss(loadingToast);
          toast.error('Detection failed');
        }
      },
      () => {
        toast.dismiss(loadingToast);
        toast.error('Location access denied');
      }
    );
  };

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
      }}>Profile</h1>

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
            fontSize: '22px', fontWeight: 700, color: 'var(--accent)', flexShrink: 0,
          }}>
            {user.name[0]}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {userCity && <><MapPin size={12} color="var(--accent)" />{userCity} · </>}
              RideSync member
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px' }}>
          {/* User details */}
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

          {/* Verified badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '10px', padding: '12px 16px',
            background: 'var(--accent-light)', borderRadius: '10px',
          }}>
            <Shield size={15} color="var(--accent)" />
            <span style={{ fontSize: '13px', color: 'var(--accent-text)', fontWeight: 500 }}>
              Verified user
            </span>
          </div>

          {/* City settings */}
          <div style={{
            padding: '20px', background: 'var(--bg-secondary)',
            borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={18} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Your city</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Live board shows groups from your city
                </div>
              </div>
            </div>

            {editingCity ? (
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Bhubaneswar"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveCity()}
                    style={{
                      flex: 1, padding: '9px 12px',
                      border: '1px solid var(--border-input)',
                      borderRadius: '8px', fontSize: '14px',
                      color: 'var(--text-primary)', background: 'var(--bg-card)', outline: 'none',
                    }}
                  />
                  <button onClick={handleSaveCity} style={{
                    padding: '9px 16px', background: 'var(--accent)',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  }}>Save</button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleDetectCity} style={{
                    flex: 1, padding: '8px', background: 'none',
                    color: 'var(--accent)', border: '1px solid var(--accent)',
                    borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  }}>
                    <MapPin size={13} /> Auto-detect
                  </button>
                  <button onClick={() => setEditingCity(false)} style={{
                    flex: 1, padding: '8px', background: 'none',
                    color: 'var(--text-secondary)', border: '1px solid var(--border)',
                    borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color={userCity ? 'var(--accent)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '14px', color: userCity ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: userCity ? 500 : 400 }}>
                    {userCity || 'No city set'}
                  </span>
                </div>
                <button onClick={() => { setNewCity(userCity); setEditingCity(true); }} style={{
                  padding: '6px 14px', background: 'none',
                  color: 'var(--accent)', border: '1px solid var(--accent)',
                  borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                }}>
                  {userCity ? 'Change' : 'Set city'}
                </button>
              </div>
            )}
          </div>

          {/* Telegram connect */}
          <div style={{
            padding: '20px', background: 'var(--bg-secondary)',
            borderRadius: '12px', border: '1px solid var(--border)', marginTop: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: '#e8f4fd',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Send size={18} color="#0088cc" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Telegram notifications
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Get instant alerts when someone joins your group
                </div>
              </div>
            </div>

            {connected ? (
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', color: '#16a34a', fontWeight: 500, marginBottom: '12px',
                }}>
                  <CheckCircle size={14} /> Telegram connected
                </div>
                <button onClick={handleDisconnectTelegram} style={{
                  width: '100%', padding: '10px', background: 'none',
                  color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}>
                  <XCircle size={14} /> Disconnect Telegram
                </button>
              </div>
            ) : !connectCode ? (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.6 }}>
                  Connect your Telegram to receive instant notifications when groups update.
                </p>
                <button onClick={handleConnectTelegram} disabled={loadingTelegram} style={{
                  width: '100%', padding: '10px', background: '#0088cc',
                  color: '#ffffff', border: 'none', borderRadius: '8px',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  opacity: loadingTelegram ? 0.7 : 1,
                }}>
                  <Send size={14} />
                  {loadingTelegram ? 'Generating code...' : 'Connect Telegram'}
                </button>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.6 }}>
                  Open <a href={telegramLink!} target="_blank" rel="noreferrer" style={{ color: '#0088cc', fontWeight: 600 }}>@RideSyncKIITBot</a> on Telegram and send:
                </p>
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '14px 16px',
                  marginBottom: '12px', textAlign: 'center',
                }}>
                  <code style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '4px', color: 'var(--accent)' }}>
                    /connect {connectCode}
                  </code>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  ⏰ Code expires in 10 minutes
                </p>
                <button onClick={() => { setConnectCode(null); setTelegramLink(null); }} style={{
                  width: '100%', padding: '9px', background: 'none',
                  color: 'var(--text-secondary)', border: '1px solid var(--border)',
                  borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
                }}>
                  Get a new code
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
