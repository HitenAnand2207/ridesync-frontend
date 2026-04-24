'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Booking } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users } from 'lucide-react';
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

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">You haven't booked any rides yet.</p>
          <Link href="/rides/search" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Find a ride
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <MapPin size={16} className="text-blue-600" />
                  {booking.ride.origin} → {booking.ride.destination}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(booking.ride.departureTime).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {booking.seats} seat{booking.seats > 1 ? 's' : ''}
                </span>
                <span className="font-medium text-blue-600">
                  ₹{booking.ride.pricePerSeat * booking.seats} total
                </span>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Driver: <span className="font-medium">{booking.ride.driver.name}</span>
                {booking.ride.driver.phone && (
                  <span className="ml-2 text-gray-500">· {booking.ride.driver.phone}</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link href={`/rides/${booking.rideId}`} className="text-sm text-blue-600 hover:underline">
                  View ride
                </Link>
                {booking.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
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