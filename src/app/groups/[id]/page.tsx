'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { RideGroup } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, Phone, Mail, ArrowLeft, MessageCircle, Smartphone, IndianRupee, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<RideGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get(`/groups/${id}`);
        setGroup(res.data.group);
      } catch {
        toast.error('Group not found');
        router.push('/groups/search');
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post(`/groups/${id}/join`);
      toast.success('You joined the group! Check WhatsApp for details.');
      const res = await api.get(`/groups/${id}`);
      setGroup(res.data.group);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    try {
      await api.patch(`/groups/${id}/leave`);
      toast.success('You left the group');
      router.push('/memberships');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to leave');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!group) return null;

  const isOrganizer = user?.id === group.organizerId;
  const isMember = group.members.some(m => m.userId === user?.id && m.status === 'CONFIRMED');
  const sharePerPerson = Math.ceil(group.estimatedFare / group.totalSlots);

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <Link href="/groups/search" style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        color: 'var(--text-secondary)', textDecoration: 'none',
        fontSize: '14px', marginBottom: '24px',
      }}>
        <ArrowLeft size={16} /> Back to search
      </Link>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 32px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{group.origin}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{group.destination}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                <IndianRupee size={18} color="var(--accent)" />
                <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>{sharePerPerson}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>your share</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>₹{group.estimatedFare} total fare</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={15} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Departure</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{new Date(group.departureTime).toLocaleString()}</div>
              </div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={15} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Slots</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{group.totalSlots - group.availableSlots}/{group.totalSlots} filled</div>
              </div>
            </div>
          </div>

          {group.description && (
            <div style={{ marginTop: '14px', padding: '12px 14px', background: 'var(--accent-light)', borderRadius: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              {group.description}
            </div>
          )}
        </div>

        {/* Members */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Members ({group.members.filter(m => m.status === 'CONFIRMED').length}/{group.totalSlots})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {group.members.filter(m => m.status === 'CONFIRMED').map((member) => (
              <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700, color: 'var(--accent)',
                  }}>
                    {member.user.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {member.user.name}
                      {member.userId === group.organizerId && (
                        <span style={{ marginLeft: '6px', fontSize: '11px', background: 'var(--accent-light)', color: 'var(--accent-text)', padding: '2px 7px', borderRadius: '10px' }}>organizer</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.user.email}</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>₹{member.share}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Organizer contact + deep links */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Organizer
          </div>
          <div style={{ display: 'flex', items: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', fontWeight: 700, color: 'var(--accent)',
              }}>
                {group.organizer.name[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{group.organizer.name}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '3px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Mail size={11} /> {group.organizer.email}
                  </span>
                  {group.organizer.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Phone size={11} /> {group.organizer.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Book cab buttons — shown to organizer */}
          {isOrganizer && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Book the cab for your group:
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {group.olaDeepLink && (
                  <a href={group.olaDeepLink} target="_blank" rel="noreferrer" style={{
                    flex: 1, padding: '11px', background: '#f97316',
                    color: '#ffffff', borderRadius: '8px', textDecoration: 'none',
                    fontSize: '13px', fontWeight: 600, textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <Smartphone size={15} /> Book on Ola
                  </a>
                )}
                {group.uberDeepLink && (
                  <a href={group.uberDeepLink} target="_blank" rel="noreferrer" style={{
                    flex: 1, padding: '11px', background: '#1c1917',
                    color: '#ffffff', borderRadius: '8px', textDecoration: 'none',
                    fontSize: '13px', fontWeight: 600, textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    <Smartphone size={15} /> Book on Uber
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action section */}
        <div style={{ padding: '24px 32px' }}>
          {isMember && !isOrganizer && (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px', background: '#dcfce7', borderRadius: '10px',
                marginBottom: '14px',
              }}>
                <CheckCircle size={18} color="#16a34a" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#15803d' }}>You're in this group</div>
                  <div style={{ fontSize: '12px', color: '#16a34a' }}>Your share: ₹{sharePerPerson} — pay the organizer directly via UPI</div>
                </div>
              </div>
              <button onClick={handleLeave} style={{
                width: '100%', padding: '11px',
                background: 'none', color: '#dc2626',
                border: '1px solid #fca5a5', borderRadius: '8px',
                fontSize: '14px', fontWeight: 500, cursor: 'pointer',
              }}>
                Leave group
              </button>
            </div>
          )}

          {!isMember && !isOrganizer && group.status === 'OPEN' && group.availableSlots > 0 && (
            <button onClick={handleJoin} disabled={joining} style={{
              width: '100%', padding: '13px',
              background: 'var(--accent)', color: '#ffffff',
              border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: 600,
              cursor: joining ? 'not-allowed' : 'pointer',
              opacity: joining ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              <Users size={18} />
              {joining ? 'Joining...' : `Join group — your share ₹${sharePerPerson}`}
            </button>
          )}

          {isOrganizer && (
            <div style={{
              padding: '14px', background: 'var(--accent-light)',
              borderRadius: '10px', fontSize: '14px', color: 'var(--accent-text)',
            }}>
              You created this group. Share the link with batchmates or let them find it through search.
            </div>
          )}

          {group.status !== 'OPEN' && !isMember && (
            <div style={{
              padding: '14px', background: '#fee2e2',
              borderRadius: '10px', fontSize: '14px', color: '#991b1b',
            }}>
              This group is no longer accepting members ({group.status}).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}