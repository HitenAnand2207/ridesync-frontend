'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Car, LogOut, User, Plus, Search } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <Car size={24} />
          RideSync
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/rides/search" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
              <Search size={16} />
              Find Ride
            </Link>
            <Link href="/rides/create" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
              <Plus size={16} />
              Offer Ride
            </Link>
            <Link href="/bookings" className="text-sm text-gray-600 hover:text-blue-600">
              My Bookings
            </Link>
            <Link href="/profile" className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
              <User size={16} />
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link href="/register" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}