'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Booking } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my');
        setBookings(res.data.bookings);
      } catch {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const statusStyle = (status: string) => ({
    fontSize: '11px', fontWeight: 600,
    padding: '4px 10px', borderRadius: '20px',
    background: status === 'CONFIRMED' ? '#dcfce7' : status === 'PENDING' ? '#fef9c3' : '#fee2e2',
    color: status === 'CONFIRMED' ? '#15803d' : status === 'PENDING' ? '#92400e' : '#991b1b',
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>Loading...</div>
  );

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '36px', fontWeight: 400,
        color: 'var(--text-primary)', marginBottom: '28px',
        letterSpacing: '-0.02em',
      }}>
        My bookings
      </h1>

      {bookings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px',
        }}>
          <p style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 500 }}>
            No bookings yet
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Find a ride and book your first seat.
          </p>
          <Link href="/rides/search" style={{
            padding: '10px 20px', background: 'var(--accent)',
            color: '#fff', borderRadius: '8px', textDecoration: 'none',
            fontSize: '14px', fontWeight: 600,
          }}>
            Find a ride
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookings.map((booking) => (
            <div key={booking.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '14px', padding: '22px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={15} color="var(--accent)" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {booking.ride.origin}
                  </span>
                  <ArrowRight size={13} color="var(--text-muted)" />
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {booking.ride.destination}
                  </span>
                </div>
                <span style={statusStyle(booking.status)}>{booking.status}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Clock size={13} />
                  {new Date(booking.ride.departureTime).toLocaleString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <Users size={13} />
                  {booking.seats} seat{booking.seats > 1 ? 's' : ''}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)' }}>
                  ₹{booking.ride.pricePerSeat * booking.seats} total
                </span>
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Driver: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  {booking.ride.driver.name}
                </span>
                {booking.ride.driver.phone && (
                  <span style={{ marginLeft: '8px' }}>· {booking.ride.driver.phone}</span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <Link href={`/rides/${booking.rideId}`} style={{
                  fontSize: '13px', color: 'var(--accent)',
                  textDecoration: 'none', fontWeight: 500,
                }}>
                  View ride
                </Link>
                {booking.status === 'CONFIRMED' && (
                  <button onClick={() => handleCancel(booking.id)} style={{
                    fontSize: '13px', color: '#dc2626',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontWeight: 500,
                  }}>
                    Cancel booking
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