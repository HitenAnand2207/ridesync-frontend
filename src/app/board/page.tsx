'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/axios';
import { RideGroup } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, ArrowRight, IndianRupee, RefreshCw, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const REFRESH_INTERVAL = 30;
const destinations = ['All', 'Airport', 'Railway Station', 'Bus Stand', 'City Center'];

function CountdownTimer({ departureTime }: { departureTime: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(departureTime).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Departed'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (h < 2) setUrgent(true);
      setTimeLeft(h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [departureTime]);

  return (
    <span style={{
      fontSize: '12px', fontWeight: 600,
      color: urgent ? '#dc2626' : '#16a34a',
      background: urgent ? '#fee2e2' : '#dcfce7',
      padding: '3px 8px', borderRadius: '20px',
    }}>
      {urgent && '⚡ '}{timeLeft}
    </span>
  );
}

export default function LiveBoardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<RideGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [filter, setFilter] = useState('All');
  const [joining, setJoining] = useState<string | null>(null);

  const fetchGroups = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get('/groups');
      setGroups(res.data.groups);
      setCountdown(REFRESH_INTERVAL);
    } catch {
      if (!silent) toast.error('Failed to load board');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { fetchGroups(true); return REFRESH_INTERVAL; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchGroups]);

  const handleJoin = async (groupId: string) => {
    if (!user) { router.push('/login'); return; }
    setJoining(groupId);
    try {
      await api.post(`/groups/${groupId}/join`);
      toast.success('Joined! Check WhatsApp for details.');
      fetchGroups(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to join');
    } finally {
      setJoining(null);
    }
  };

  const filtered = filter === 'All'
    ? groups
    : groups.filter(g => g.destination.toLowerCase().includes(filter.toLowerCase()));

  const slotPercent = (g: RideGroup) =>
    ((g.totalSlots - g.availableSlots) / g.totalSlots) * 100;

  const statusLabel = (g: RideGroup) => {
    if (g.availableSlots === 0) return { label: 'Full', bg: '#fee2e2', color: '#991b1b' };
    if (slotPercent(g) >= 50) return { label: 'Filling fast', bg: '#fef9c3', color: '#92400e' };
    return { label: 'Open', bg: '#dcfce7', color: '#15803d' };
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '36px', fontWeight: 400,
              color: 'var(--text-primary)', letterSpacing: '-0.02em',
            }}>
              Live board
            </h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: '#dcfce7', borderRadius: '20px',
              padding: '4px 10px', fontSize: '12px', fontWeight: 600, color: '#15803d',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#16a34a', display: 'inline-block',
              }} />
              Live
            </div>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            All active groups — refreshes in <strong style={{ color: 'var(--text-primary)' }}>{countdown}s</strong>
          </p>
        </div>

        <button onClick={() => fetchGroups(true)} disabled={refreshing} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '9px 16px', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: '8px',
          fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)',
          cursor: 'pointer',
        }}>
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {destinations.map(dest => (
          <button key={dest} onClick={() => setFilter(dest)} style={{
            padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 500,
            border: `1.5px solid ${filter === dest ? 'var(--accent)' : 'var(--border)'}`,
            background: filter === dest ? 'var(--accent-light)' : 'var(--bg-card)',
            color: filter === dest ? 'var(--accent-text)' : 'var(--text-secondary)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {dest}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          Loading board...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px',
        }}>
          <Zap size={40} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No active groups
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Be the first to start a group for this route.
          </p>
          <Link href="/groups/create" style={{
            padding: '10px 20px', background: 'var(--accent)',
            color: '#fff', borderRadius: '8px', textDecoration: 'none',
            fontSize: '14px', fontWeight: 600,
          }}>
            Start a group
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {filtered.map((group) => {
            const status = statusLabel(group);
            const share = Math.ceil(group.estimatedFare / group.totalSlots);
            const isMember = group.members?.some(m => m.userId === user?.id && m.status === 'CONFIRMED');
            const isOrganizer = group.organizerId === user?.id;
            const pct = slotPercent(group);

            return (
              <div key={group.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '14px', padding: '20px 22px',
                display: 'flex', flexDirection: 'column', gap: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <MapPin size={13} color="var(--accent)" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {group.origin}
                      </span>
                      <ArrowRight size={12} color="var(--text-muted)" />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {group.destination}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <Clock size={11} />
                        {new Date(group.departureTime).toLocaleString()}
                      </span>
                      <CountdownTimer departureTime={group.departureTime} />
                    </div>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600,
                    padding: '4px 10px', borderRadius: '20px',
                    background: status.bg, color: status.color,
                    flexShrink: 0, marginLeft: '8px',
                  }}>
                    {status.label}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={11} />
                      {group.totalSlots - group.availableSlots}/{group.totalSlots} slots filled
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>
                      <IndianRupee size={13} />{share}
                      <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)' }}>/person</span>
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px',
                      width: `${pct}%`,
                      background: pct >= 75 ? '#dc2626' : pct >= 50 ? '#f59e0b' : '#16a34a',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {group.members?.filter(m => m.status === 'CONFIRMED').slice(0, 4).map((m, i) => (
                      <div key={m.id} style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: ['#bfdbfe', '#bbf7d0', '#fde68a', '#fecaca'][i % 4],
                        border: '2px solid var(--bg-card)',
                        marginLeft: i > 0 ? '-8px' : '0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: '#374151',
                        position: 'relative' as const,
                        zIndex: 4 - i,
                      }}>
                        {m.user.name[0]}
                      </div>
                    ))}
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                      by {group.organizer.name.split(' ')[0]}
                    </span>
                  </div>

                  {isMember || isOrganizer ? (
                    <Link href={`/groups/${group.id}`} style={{
                      fontSize: '12px', fontWeight: 600, color: 'var(--accent)',
                      textDecoration: 'none', padding: '6px 14px',
                      border: '1.5px solid var(--accent)', borderRadius: '8px',
                    }}>
                      View
                    </Link>
                  ) : group.availableSlots > 0 ? (
                    <button onClick={() => handleJoin(group.id)} disabled={joining === group.id} style={{
                      fontSize: '12px', fontWeight: 600, color: '#fff',
                      background: 'var(--accent)', border: 'none',
                      padding: '7px 16px', borderRadius: '8px',
                      cursor: joining === group.id ? 'not-allowed' : 'pointer',
                      opacity: joining === group.id ? 0.7 : 1,
                    }}>
                      {joining === group.id ? 'Joining...' : `Join ₹${share}`}
                    </button>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Full</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}