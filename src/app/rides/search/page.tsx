'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { MatchedRide } from '@/types';
import toast from 'react-hot-toast';
import { Search, MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SearchRidesPage() {
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    seats: '1',
  });
  const [results, setResults] = useState<MatchedRide[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get('/match', { params: form });
      setResults(res.data.matches);
      setSearched(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Search failed');
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
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '36px', fontWeight: 400,
        color: 'var(--text-primary)',
        marginBottom: '24px',
        letterSpacing: '-0.02em',
      }}>
        Find a ride
      </h1>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '32px',
      }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>From</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                style={inputStyle}
                placeholder="KIIT University"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>To</label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                style={inputStyle}
                placeholder="Bhubaneswar Airport"
                required
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Departure date & time</label>
              <input
                type="datetime-local"
                value={form.departureTime}
                onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Seats needed</label>
              <input
                type="number"
                min="1"
                max="6"
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px',
            background: 'var(--accent)', color: '#ffffff',
            border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            opacity: loading ? 0.7 : 1,
          }}>
            <Search size={16} />
            {loading ? 'Searching...' : 'Search rides'}
          </button>
        </form>
      </div>

      {searched && results.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px',
        }}>
          <Search size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No rides found
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Try adjusting your search or offer a ride yourself.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {results.map(({ ride, score, reasons }) => (
          <div key={ride.id} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px', padding: '22px 24px',
            transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <MapPin size={15} color="var(--accent)" />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ride.origin}
                  </span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ride.destination}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Clock size={13} />
                    {new Date(ride.departureTime).toLocaleString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Users size={13} />
                    {ride.availableSeats} seats left
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>
                  ₹{ride.pricePerSeat}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>per seat</div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '3px',
                  justifyContent: 'flex-end', marginTop: '4px',
                  fontSize: '12px', color: '#16a34a', fontWeight: 500,
                }}>
                  <Star size={11} fill="#16a34a" />
                  {score} match
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {reasons.map((reason, i) => (
                <span key={i} style={{
                  fontSize: '12px', padding: '3px 10px',
                  background: 'var(--accent-light)', color: 'var(--accent-text)',
                  borderRadius: '20px', fontWeight: 500,
                }}>
                  {reason}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Driver: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ride.driver.name}</span>
              </span>
              <Link href={`/rides/${ride.id}`} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', background: 'var(--accent)',
                color: '#ffffff', borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              }}>
                View & Book <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}