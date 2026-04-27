'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import api from '@/lib/axios';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, otp: code });
      toast.success('Email verified! Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('New OTP sent to your email');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', background: 'var(--accent-light)',
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <Mail size={26} color="var(--accent)" />
          </div>
          <h1 style={{
            fontSize: '24px', fontWeight: 700,
            color: 'var(--text-primary)', marginBottom: '8px',
          }}>
            Verify your email
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', padding: '32px',
        }}>
          {/* OTP inputs */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '28px' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{
                  width: '48px', height: '56px',
                  textAlign: 'center', fontSize: '22px', fontWeight: 700,
                  border: `2px solid ${digit ? 'var(--accent)' : 'var(--border-input)'}`,
                  borderRadius: '10px', outline: 'none',
                  color: 'var(--text-primary)', background: 'var(--bg-card)',
                  transition: 'border-color 0.15s',
                }}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            style={{
              width: '100%', padding: '12px',
              background: otp.join('').length === 6 ? 'var(--accent)' : 'var(--border)',
              color: otp.join('').length === 6 ? '#ffffff' : 'var(--text-muted)',
              border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: 600,
              cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed',
              marginBottom: '16px',
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'Verifying...' : 'Verify email'}
          </button>

          <div style={{ textAlign: 'center' }}>
            {countdown > 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Resend OTP in <strong style={{ color: 'var(--text-primary)' }}>{countdown}s</strong>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', color: 'var(--accent)', fontWeight: 500,
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <RefreshCw size={13} />
                {resending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none',
          }}>
            <ArrowLeft size={13} /> Back to register
          </Link>
        </div>
      </div>
    </div>
  );
}