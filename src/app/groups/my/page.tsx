'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { RideGroup } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, Plus, ArrowRight, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function MyGroupsPage() {
  const [groups, setGroups] = useState<RideGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get('/groups/my');
        setGroups(res.data.groups);
      } catch {
        toast.error('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/groups/${id}/cancel`);
      toast.success('Group cancelled');
      setGroups(groups.map(g => g.id === id ? { ...g, status: 'CANCELLED' } : g));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const statusStyle = (status: string) => ({
    fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px',
    background: status === 'OPEN' ? '#dcfce7' : status === 'FULL' ? '#fef9c3' : status === 'DEPARTED' ? '#dbeafe' : '#fee2e2',
    color: status === 'OPEN' ? '#15803d' : status === 'FULL' ? '#92400e' : status === 'DEPARTED' ? '#1d4ed8' : '#991b1b',
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          My groups
        </h1>
        <Link href="/groups/create" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '9px 18px', background: 'var(--accent)',
          color: '#ffffff', borderRadius: '8px',
          fontSize: '13px', fontWeight: 600, textDecoration: 'none',
        }}>
          <Plus size={15} /> New group
        </Link>
      </div>

      {groups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <p style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 500 }}>No groups yet</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Start a group and split the cab fare with people nearby.</p>
          <Link href="/groups/create" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Start a group
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {groups.map((group) => (
            <div key={group.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="var(--accent)" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{group.origin}</span>
                  <ArrowRight size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{group.destination}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!group.platformFeePaid && (
                    <span style={{ fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '20px', background: '#fef9c3', color: '#92400e' }}>
                      draft
                    </span>
                  )}
                  <span style={statusStyle(group.status)}>{group.status}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Clock size={13} />{new Date(group.departureTime).toLocaleString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Users size={13} />{group.totalSlots - group.availableSlots}/{group.totalSlots} members
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
                  <IndianRupee size={13} />{Math.ceil(group.estimatedFare / group.totalSlots)}/person
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <Link href={`/groups/${group.id}`} style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                  View group
                </Link>
                {group.status === 'OPEN' && group.platformFeePaid && (
                  <button onClick={() => handleCancel(group.id)} style={{
                    fontSize: '13px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500,
                  }}>
                    Cancel group
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
