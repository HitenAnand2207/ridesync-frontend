'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Car } from 'lucide-react';

export default function CreateRidePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    totalSeats: '3',
    pricePerSeat: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/rides', {
        ...form,
        totalSeats: parseInt(form.totalSeats),
        pricePerSeat: parseFloat(form.pricePerSeat),
        departureTime: new Date(form.departureTime).toISOString(),
      });
      toast.success('Ride created successfully!');
      router.push('/rides/my');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--border-input)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    background: 'var(--bg-card)',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <div style={{
          width: '42px', height: '42px', background: 'var(--accent-light)',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Car size={20} color="var(--accent)" />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px', fontWeight: 400,
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
        }}>
          Offer a ride
        </h1>
      </div>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px', padding: '32px',
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>From</label>
              <input type="text" value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                style={inputStyle} placeholder="KIIT University" required />
            </div>
            <div>
              <label style={labelStyle}>To</label>
              <input type="text" value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                style={inputStyle} placeholder="Bhubaneswar Airport" required />
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
              <label style={labelStyle}>Total seats</label>
              <input type="number" min="1" max="6" value={form.totalSeats}
                onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
                style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Price per seat (₹)</label>
              <input type="number" min="0" value={form.pricePerSeat}
                onChange={(e) => setForm({ ...form, pricePerSeat: e.target.value })}
                style={inputStyle} placeholder="150" required />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Description (optional)</label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical', minHeight: '90px', fontFamily: 'inherit' }}
              placeholder="Any additional details about the ride..." />
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px',
            background: 'var(--accent)', color: '#ffffff',
            border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Creating...' : 'Create ride'}
          </button>
        </form>
      </div>
    </div>
  );
}