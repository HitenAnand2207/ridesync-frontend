import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'RideSync — Share Cabs. Split the Fare.',
  description: 'Find people heading your way. Share one cab, split the cost.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
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