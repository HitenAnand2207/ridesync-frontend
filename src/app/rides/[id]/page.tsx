'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Ride } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, Phone, Mail, ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RideDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await api.get(`/rides/${id}`);
        setRide(res.data.ride);
      } catch {
        toast.error('Ride not found');
        router.push('/rides/search');
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id]);

  const handlePayment = async () => {
    if (!user || !ride) return;
    setPaying(true);

    try {
      const res = await api.post(`/rides/${id}/pay`, { seats });
      const { orderId, amount, currency, bookingId, keyId } = res.data;

      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: 'RideSync',
        description: `${ride.origin} → ${ride.destination}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId,
            });
            toast.success('Payment successful! Ride booked.');
            router.push('/bookings');
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: { color: '#4f46e5' },
        modal: {
          ondismiss: () => {
            toast.error('Payment cancelled');
            setPaying(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setPaying(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
      Loading...
    </div>
  );
  if (!ride) return null;

  const isDriver = user?.id === ride.driverId;
  const totalFare = ride.pricePerSeat * seats;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <Link href="/rides/search" style={{
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
          padding: '28px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#16a34a', flexShrink: 0,
                }} />
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {ride.origin}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: 'var(--accent)', flexShrink: 0,
                }} />
                <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {ride.destination}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '28px', fontWeight: 700,
                color: 'var(--accent)', fontFamily: 'var(--font-display)',
              }}>
                ₹{ride.pricePerSeat}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>per seat</div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              padding: '14px', background: 'var(--bg-secondary)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <Clock size={16} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Departure</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {new Date(ride.departureTime).toLocaleString()}
                </div>
              </div>
            </div>
            <div style={{
              padding: '14px', background: 'var(--bg-secondary)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <Users size={16} color="var(--accent)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Seats available</div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {ride.availableSeats} / {ride.totalSeats}
                </div>
              </div>
            </div>
          </div>

          {ride.description && (
            <div style={{
              marginTop: '16px', padding: '14px',
              background: 'var(--accent-light)', borderRadius: '10px',
              fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              {ride.description}
            </div>
          )}
        </div>

        {/* Driver */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Driver
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'var(--accent-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 700, color: 'var(--accent)',
            }}>
              {ride.driver.name[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {ride.driver.name}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <Mail size={12} /> {ride.driver.email}
                </span>
                {ride.driver.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <Phone size={12} /> {ride.driver.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking section */}
        <div style={{ padding: '24px 32px' }}>
          {!isDriver && ride.status === 'ACTIVE' && ride.availableSeats > 0 ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={ride.availableSeats}
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value))}
                    style={{
                      width: '80px', padding: '9px 12px',
                      border: '1px solid var(--border-input)',
                      borderRadius: '8px', fontSize: '14px',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-card)',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total fare</div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{totalFare}
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paying}
                style={{
                  width: '100%', padding: '13px',
                  background: paying ? 'var(--text-muted)' : 'var(--accent)',
                  color: '#ffffff', border: 'none',
                  borderRadius: '10px', fontSize: '15px', fontWeight: 600,
                  cursor: paying ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                }}
              >
                <CreditCard size={18} />
                {paying ? 'Processing...' : `Pay ₹${totalFare} & Book`}
              </button>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', marginTop: '12px',
                fontSize: '12px', color: 'var(--text-muted)',
              }}>
                <Shield size={12} />
                Secured by Razorpay — UPI, Cards, Net Banking accepted
              </div>
            </div>
          ) : isDriver ? (
            <div style={{
              padding: '14px 16px', background: '#fef9c3',
              border: '1px solid #fde047', borderRadius: '10px',
              fontSize: '14px', color: '#92400e',
            }}>
              This is your ride — you cannot book your own ride.
            </div>
          ) : (
            <div style={{
              padding: '14px 16px', background: '#fee2e2',
              border: '1px solid #fca5a5', borderRadius: '10px',
              fontSize: '14px', color: '#991b1b',
            }}>
              This ride is no longer available ({ride.status}).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}