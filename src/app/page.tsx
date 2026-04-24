'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Car, Search, Plus, Shield } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="text-center py-20">
        <div className="flex justify-center mb-6">
          <Car size={64} className="text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Campus Ride Sharing
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Share rides with fellow KIIT students. Save money, reduce traffic, and travel together.
        </p>

        <div className="flex justify-center gap-4">
          {user ? (
            <>
              <Link href="/rides/search" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
                Find a Ride
              </Link>
              <Link href="/rides/create" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50">
                Offer a Ride
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
                Get Started
              </Link>
              <Link href="/login" className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg hover:bg-blue-50">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
        <div className="text-center p-6 rounded-xl border border-gray-200">
          <Search size={40} className="text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Find Rides</h3>
          <p className="text-gray-600">Search for rides matching your route and schedule.</p>
        </div>
        <div className="text-center p-6 rounded-xl border border-gray-200">
          <Plus size={40} className="text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Offer Rides</h3>
          <p className="text-gray-600">Going somewhere? Offer seats and split the cost.</p>
        </div>
        <div className="text-center p-6 rounded-xl border border-gray-200">
          <Shield size={40} className="text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Campus Safe</h3>
          <p className="text-gray-600">Only verified KIIT students can join the platform.</p>
        </div>
      </div>
    </div>
  );
}