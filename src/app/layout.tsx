import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'RideSync — Campus Ride Sharing',
  description: 'Share rides with fellow KIIT students',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {children}
          </main>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '14px',
                fontFamily: 'var(--font-body)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}