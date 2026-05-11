'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Users, IndianRupee, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PlacesAutocomplete from '@/components/ui/PlacesAutocomplete';

export default function CreateGroupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    origin: '', destination: '', departureTime: '',
    totalSlots: '3', estimatedFare: '', description: '',
    womenOnly: false,
    originLat: '', originLng: '',
    destLat: '', destLng: '',
    city: '',
  });

  const sharePerPerson = form.estimatedFare && form.totalSlots
    ? Math.ceil(parseFloat(form.estimatedFare) / parseInt(form.totalSlots))
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.post('/groups', {
        ...form,
        totalSlots: parseInt(form.totalSlots),
        estimatedFare: parseFloat(form.estimatedFare),
        departureTime: new Date(form.departureTime).toISOString(),
      });

      const group = res.data.group;
      toast.success('Group created! Pay ₹30 to make it visible.');
      setPaying(true);

      const payRes = await api.post(`/groups/${group.id}/pay`);
      const { orderId, amount, currency, keyId } = payRes.data;

      const options = {
        key: keyId, amount, currency,
        name: 'RideSync',
        description: 'Platform fee — activate your group',
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              groupId: group.id,
            });
            toast.success('Group is now live!');
            router.push(`/groups/${group.id}`);
          } catch {
            toast.error('Payment verification failed.');
          } finally {
            setPaying(false);
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#4f46e5' },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled. Group saved as draft.');
            setPaying(false);
            router.push('/groups/my');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create group');
      setPaying(false);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1px solid var(--border-input)', borderRadius: '8px',
    fontSize: '14px', color: 'var(--text-primary)',
    background: 'var(--bg-card)', outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{
          width: '42px', height: '42px', background: 'var(--accent-light)',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Users size={20} color="var(--accent)" />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 400,
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
        }}>Start a group</h1>
      </div>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
        Create a group and pay ₹30 to make it visible to others.
      </p>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '32px',
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>From</label>
              <PlacesAutocomplete
                value={form.origin}
                onChange={(val, lat, lng) => setForm({
                  ...form, origin: val,
                  originLat: lat?.toString() || '',
                  originLng: lng?.toString() || '',
                  city: val.split(',').slice(-2, -1)[0]?.trim() || form.city,
                })}
                placeholder="Pickup location"
              />
            </div>
            <div>
              <label style={labelStyle}>To</label>
              <PlacesAutocomplete
                value={form.destination}
                onChange={(val, lat, lng) => setForm({
                  ...form, destination: val,
                  destLat: lat?.toString() || '',
                  destLng: lng?.toString() || '',
                })}
                placeholder="Drop location"
              />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Departure date & time</label>
            <input type="datetime-local" value={form.departureTime}
              onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
              style={inputStyle} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Total slots (including you)</label>
              <input type="number" min="2" max="6" value={form.totalSlots}
                onChange={(e) => setForm({ ...form, totalSlots: e.target.value })}
                style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Estimated total fare (₹)</label>
              <input type="number" min="0" value={form.estimatedFare}
                onChange={(e) => setForm({ ...form, estimatedFare: e.target.value })}
                style={inputStyle} placeholder="400" required />
            </div>
          </div>

          {sharePerPerson > 0 && (
            <div style={{
              padding: '14px 16px', background: 'var(--accent-light)',
              borderRadius: '10px', marginBottom: '14px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <IndianRupee size={16} color="var(--accent)" />
              <span style={{ fontSize: '14px', color: 'var(--accent-text)', fontWeight: 500 }}>
                Each person pays ₹{sharePerPerson}
              </span>
            </div>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', background: 'var(--bg-secondary)',
            borderRadius: '10px', marginBottom: '14px',
            border: form.womenOnly ? '1.5px solid #ec4899' : '1px solid var(--border)',
            transition: 'border-color 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={16} color={form.womenOnly ? '#ec4899' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Women only group
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Only women can join this group
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, womenOnly: !form.womenOnly })}
              style={{
                width: '44px', height: '24px', borderRadius: '12px',
                border: 'none', cursor: 'pointer',
                background: form.womenOnly ? '#ec4899' : 'var(--border)',
                position: 'relative', transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: form.womenOnly ? '23px' : '3px',
                width: '18px', height: '18px',
                borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Description (optional)</label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
              placeholder="AC cab preferred, early morning..." />
          </div>

          <div style={{
            padding: '14px 16px', background: 'var(--bg-secondary)',
            borderRadius: '10px', marginBottom: '20px',
            fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6,
          }}>
            A one-time <strong style={{ color: 'var(--text-primary)' }}>₹30 platform fee</strong> activates your group and makes it visible to others.
          </div>

          <button type="submit" disabled={loading || paying} style={{
            width: '100%', padding: '12px',
            background: 'var(--accent)', color: '#ffffff',
            border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: 600,
            cursor: (loading || paying) ? 'not-allowed' : 'pointer',
            opacity: (loading || paying) ? 0.7 : 1,
          }}>
            {loading ? 'Creating...' : paying ? 'Opening payment...' : 'Create group & pay ₹30'}
          </button>
        </form>
      </div>
    </div>
  );
}