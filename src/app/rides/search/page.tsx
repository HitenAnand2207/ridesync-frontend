'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { MatchedRide } from '@/types';
import toast from 'react-hot-toast';
import { Search, MapPin, Clock, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default function SearchRidesPage() {
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    seats: '1',
  });
  const [results, setResults] = useState<MatchedRide[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get('/match', { params: form });
      setResults(res.data.matches);
      setSearched(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Find a Ride</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="KIIT University"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="text"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bhubaneswar Airport"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
              <input
                type="datetime-local"
                value={form.departureTime}
                onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats needed</label>
              <input
                type="number"
                min="1"
                max="6"
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Search size={18} />
            {loading ? 'Searching...' : 'Search Rides'}
          </button>
        </form>
      </div>

      {searched && results.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No rides found for your route.</p>
          <p className="text-sm mt-2">Try adjusting your search or offer a ride yourself.</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map(({ ride, score, reasons }) => (
          <div key={ride.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <MapPin size={18} className="text-blue-600" />
                  {ride.origin}
                  <span className="text-gray-400">→</span>
                  {ride.destination}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(ride.departureTime).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {ride.availableSeats} seats left
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">₹{ride.pricePerSeat}</div>
                <div className="text-xs text-gray-500">per seat</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                  <Star size={12} />
                  {score} match
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {reasons.map((reason, i) => (
                <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  {reason}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Driver: <span className="font-medium">{ride.driver.name}</span>
              </div>
              <Link
                href={`/rides/${ride.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                View & Book
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}