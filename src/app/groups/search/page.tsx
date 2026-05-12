'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { MatchedGroup } from '@/types';
import toast from 'react-hot-toast';
import { Search, Clock, Users, Star, ArrowRight, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import PlacesAutocomplete from '@/components/ui/PlacesAutocomplete';

export default function SearchGroupsPage() {
  const [form, setForm] = useState({
    origin: '', destination: '', departureTime: '', slots: '1',
    originLat: '', originLng: '', destLat: '', destLng: '',
  });
  const [results, setResults] = useState<MatchedGroup[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get('/match', { params: {
        origin: form.origin,
        destination: form.destination,
        departureTime: form.departureTime,
        slots: form.slots,
      }});
      setResults(res.data.matches);
      setSearched(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Search failed');
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

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '36px', fontWeight: 400,
        color: 'var(--text-primary)', marginBottom: '8px',
        letterSpacing: '-0.02em',
      }}>Find a group</h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px' }}>
        Search for people heading your way.
      </p>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '28px', marginBottom: '32px',
      }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>From</label>
              <PlacesAutocomplete
                value={form.origin}
                onChange={(val, lat, lng) => setForm({
                  ...form, origin: val,
                  originLat: lat?.toString() || '',
                  originLng: lng?.toString() || '',
                })}
                placeholder="Pickup location"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>To</label>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Departure date & time</label>
              <input type="datetime-local" value={form.departureTime}
                onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                style={inputStyle} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>Slots needed</label>
              <input type="number" min="1" max="4" value={form.slots}
                onChange={(e) => setForm({ ...form, slots: e.target.value })}
                style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: 'var(--accent)',
            color: '#ffffff', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: loading ? 0.7 : 1,
          }}>
            <Search size={16} />
            {loading ? 'Searching...' : 'Search groups'}
          </button>
        </form>
      </div>

      {searched && results.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px',
        }}>
          <Search size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>No groups found</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Be the first to start a group for this route.
          </p>
          <Link href="/groups/create" style={{
            padding: '10px 20px', background: 'var(--accent)',
            color: '#fff', borderRadius: '8px', textDecoration: 'none',
            fontSize: '14px', fontWeight: 600,
          }}>Start a group</Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {results.map(({ group, score, reasons }) => (
          <div key={group.id} style={{
            background: 'var(--bg-card)', border: `1px solid ${group.womenOnly ? '#fbcfe8' : 'var(--border)'}`,
            borderRadius: '14px', padding: '22px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{group.origin}</span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{group.destination}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Clock size={13} />{new Date(group.departureTime).toLocaleString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Users size={13} />{group.availableSlots} slots left
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                  <IndianRupee size={16} color="var(--accent)" />
                  <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>
                    {Math.ceil(group.estimatedFare / group.totalSlots)}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>your share</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end', marginTop: '4px', fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
                  <Star size={11} fill="#16a34a" />{score} match
                </div>
              </div>
            </div>

            {group.womenOnly && (
              <span style={{
                display: 'inline-block', fontSize: '12px', fontWeight: 600,
                padding: '3px 10px', borderRadius: '20px',
                background: '#fce7f3', color: '#be185d', marginBottom: '10px',
              }}>
                👩 Women only
              </span>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
              {reasons.map((reason, i) => (
                <span key={i} style={{
                  fontSize: '12px', padding: '3px 10px',
                  background: 'var(--accent-light)', color: 'var(--accent-text)',
                  borderRadius: '20px', fontWeight: 500,
                }}>{reason}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Organizer: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{group.organizer.name}</span>
                <span style={{ marginLeft: '8px' }}>· {group._count?.members} member{group._count?.members !== 1 ? 's' : ''}</span>
              </span>
              <Link href={`/groups/${group.id}`} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', background: group.womenOnly ? '#ec4899' : 'var(--accent)',
                color: '#ffffff', borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, textDecoration: 'none',
              }}>
                View & Join <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}