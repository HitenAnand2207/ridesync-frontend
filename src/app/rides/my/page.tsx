'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Ride } from '@/types';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, Plus } from 'lucide-react';
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

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Rides</h1>
        <Link href="/rides/create" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
          <Plus size={16} />
          New Ride
        </Link>
      </div>

      {rides.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-4">You haven't offered any rides yet.</p>
          <Link href="/rides/create" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Offer your first ride
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => (
            <div key={ride.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  <MapPin size={16} className="text-blue-600" />
                  {ride.origin} → {ride.destination}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  ride.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                  ride.status === 'FULL' ? 'bg-yellow-100 text-yellow-700' :
                  ride.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {ride.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(ride.departureTime).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {ride.availableSeats}/{ride.totalSeats} seats
                </span>
                <span className="font-medium text-blue-600">₹{ride.pricePerSeat}/seat</span>
              </div>

              <div className="flex items-center justify-between">
                <Link href={`/rides/${ride.id}`} className="text-sm text-blue-600 hover:underline">
                  View details
                </Link>
                {ride.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleCancel(ride.id)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
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