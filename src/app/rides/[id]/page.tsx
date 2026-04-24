'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Ride } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RideDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
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

  const handleBook = async () => {
    setBooking(true);
    try {
      await api.post(`/rides/${id}/book`, { seats });
      toast.success('Ride booked successfully!');
      router.push('/bookings');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (!ride) return null;

  const isDriver = user?.id === ride.driverId;

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/rides/search" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
        <ArrowLeft size={18} />
        Back to search
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <MapPin size={22} className="text-blue-600" />
              {ride.origin}
            </div>
            <div className="text-gray-400 ml-7 my-1">↓</div>
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <MapPin size={22} className="text-red-500" />
              {ride.destination}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">₹{ride.pricePerSeat}</div>
            <div className="text-sm text-gray-500">per seat</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={18} className="text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Departure</div>
              <div className="font-medium">{new Date(ride.departureTime).toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={18} className="text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Seats available</div>
              <div className="font-medium">{ride.availableSeats} / {ride.totalSeats}</div>
            </div>
          </div>
        </div>

        {ride.description && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg text-gray-700 text-sm">
            {ride.description}
          </div>
        )}

        <div className="border-t border-gray-100 pt-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Driver</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
              {ride.driver.name[0]}
            </div>
            <div>
              <div className="font-medium text-gray-900">{ride.driver.name}</div>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Mail size={12} />{ride.driver.email}</span>
                {ride.driver.phone && (
                  <span className="flex items-center gap-1"><Phone size={12} />{ride.driver.phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isDriver && ride.status === 'ACTIVE' && ride.availableSeats > 0 && (
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Seats</label>
              <input
                type="number"
                min="1"
                max={ride.availableSeats}
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value))}
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleBook}
              disabled={booking}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {booking ? 'Booking...' : `Book ${seats} seat${seats > 1 ? 's' : ''} — ₹${ride.pricePerSeat * seats}`}
            </button>
          </div>
        )}

        {isDriver && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
            This is your ride. You cannot book your own ride.
          </div>
        )}

        {ride.status !== 'ACTIVE' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
            This ride is no longer available ({ride.status}).
          </div>
        )}
      </div>
    </div>
  );
}