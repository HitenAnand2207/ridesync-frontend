'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Ride } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MyRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await api.get('/rides/my');
        setRides(res.data.rides);
      } catch {
        toast.error('Failed to load rides');
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/rides/${id}/cancel`);
      toast.success('Ride cancelled');
      setRides(rides.map(r => r.id === id ? { ...r, status: 'CANCELLED' } : r));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const statusStyle = (status: string) => ({
    fontSize: '11px', fontWeight: 600,
    padding: '4px 10px', borderRadius: '20px',
    background: status === 'ACTIVE' ? '#dcfce7' : status === 'FULL' ? '#fef9c3' : status === 'COMPLETED' ? '#dbeafe' : '#fee2e2',
    color: status === 'ACTIVE' ? '#15803d' : status === 'FULL' ? '#92400e' : status === 'COMPLETED' ? '#1d4ed8' : '#991b1b',
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading...</div>
  );

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px', fontWeight: 400,
          color: 'var(--text-primary)', letterSpacing: '-0.02em',
        }}>
          My rides
        </h1>
        <Link href="/rides/create" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '9px 18px', background: 'var(--accent)',
          color: '#ffffff', borderRadius: '8px',
          fontSize: '13px', fontWeight: 600, textDecoration: 'none',
        }}>
          <Plus size={15} /> New ride
        </Link>
      </div>

      {rides.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px',
        }}>
          <p style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 500 }}>
            No rides offered yet
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Going somewhere? Share your ride and split the cost.
          </p>
          <Link href="/rides/create" style={{
            padding: '10px 20px', background: 'var(--accent)',
            color: '#fff', borderRadius: '8px', textDecoration: 'none',
            fontSize: '14px', fontWeight: 600,
          }}>
            Offer your first ride
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rides.map((ride) => (
            <div key={ride.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '14px', padding: '22px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="var(--accent)" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ride.origin}
                  </span>
                  <ArrowRight size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ride.destination}
                  </span>
                </div>
                <span style={statusStyle(ride.status)}>{ride.status}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Clock size={13} />
                  {new Date(ride.departureTime).toLocaleString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Users size={13} />
                  {ride.availableSeats}/{ride.totalSeats} seats
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
                  ₹{ride.pricePerSeat}/seat
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <Link href={`/rides/${ride.id}`} style={{
                  fontSize: '13px', color: 'var(--accent)',
                  textDecoration: 'none', fontWeight: 500,
                }}>
                  View details
                </Link>
                {ride.status === 'ACTIVE' && (
                  <button onClick={() => handleCancel(ride.id)} style={{
                    fontSize: '13px', color: '#dc2626',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontWeight: 500,
                  }}>
                    Cancel ride
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