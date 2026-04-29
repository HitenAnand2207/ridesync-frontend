'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Membership } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, ArrowRight, IndianRupee, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await api.get('/groups/memberships');
        setMemberships(res.data.memberships);
      } catch {
        toast.error('Failed to load memberships');
      } finally {
        setLoading(false);
      }
    };
    fetchMemberships();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 400, color: 'var(--text-primary)', marginBottom: '28px', letterSpacing: '-0.02em' }}>
        My groups
      </h1>

      {memberships.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <p style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 500 }}>No groups joined yet</p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Find a group heading your way.</p>
          <Link href="/groups/search" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Find a group
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {memberships.map((membership) => (
            <div key={membership.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="var(--accent)" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{membership.group.origin}</span>
                  <ArrowRight size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{membership.group.destination}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#15803d', background: '#dcfce7', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                  <CheckCircle size={12} /> Confirmed
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Clock size={13} />{new Date(membership.group.departureTime).toLocaleString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Users size={13} />{membership.group.totalSlots - membership.group.availableSlots}/{membership.group.totalSlots} members
                </span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 14px', background: 'var(--accent-light)',
                borderRadius: '10px', marginBottom: '14px',
              }}>
                <IndianRupee size={15} color="var(--accent)" />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-text)' }}>
                  Your share: ₹{membership.share}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                  — pay organizer <strong style={{ color: 'var(--text-primary)' }}>{membership.group.organizer.name}</strong> via UPI
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <Link href={`/groups/${membership.groupId}`} style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                  View group details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}