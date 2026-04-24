'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  if (loading || !user) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
            {user.name[0]}
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">KIIT Student</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <User size={18} className="text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Full Name</div>
              <div className="font-medium text-gray-900">{user.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail size={18} className="text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium text-gray-900">{user.email}</div>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone size={18} className="text-blue-600" />
              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div className="font-medium text-gray-900">{user.phone}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}