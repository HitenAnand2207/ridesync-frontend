'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Users, MapPin, MessageCircle, Smartphone, Zap } from 'lucide-react';

const HeroIllustration = () => (
  <svg viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '640px' }}>
    <rect width="600" height="320" fill="var(--bg-secondary)" rx="16" />
    <rect x="0" y="240" width="600" height="80" fill="#d6d3d1" />
    <rect x="0" y="238" width="600" height="6" fill="#a8a29e" />
    {[40, 120, 200, 280, 360, 440, 520].map((x, i) => (
      <rect key={i} x={x} y="272" width="44" height="8" rx="4" fill="white" opacity="0.6" />
    ))}
    <circle cx="480" cy="70" r="28" fill="#fde047" opacity="0.8" />
    <ellipse cx="120" cy="60" rx="50" ry="22" fill="white" opacity="0.6" />
    <ellipse cx="150" cy="52" rx="35" ry="20" fill="white" opacity="0.6" />
    <rect x="20" y="140" width="60" height="100" fill="#78716c" rx="4" />
    <rect x="90" y="100" width="50" height="140" fill="#57534e" rx="4" />
    <rect x="480" y="130" width="55" height="110" fill="#78716c" rx="4" />
    <rect x="545" y="160" width="45" height="80" fill="#a8a29e" rx="4" />
    <g transform="translate(220, 200)">
      <rect x="0" y="20" width="120" height="40" fill="#4f46e5" rx="6" />
      <rect x="10" y="8" width="100" height="36" fill="#6366f1" rx="8" />
      <rect x="16" y="12" width="38" height="24" fill="#bfdbfe" opacity="0.9" rx="4" />
      <rect x="62" y="12" width="38" height="24" fill="#bfdbfe" opacity="0.9" rx="4" />
      <circle cx="22" cy="62" r="13" fill="#1c1917" />
      <circle cx="22" cy="62" r="8" fill="#44403c" />
      <circle cx="98" cy="62" r="13" fill="#1c1917" />
      <circle cx="98" cy="62" r="8" fill="#44403c" />
      <rect x="2" y="28" width="8" height="6" fill="#fde047" rx="2" />
      <rect x="110" y="28" width="8" height="6" fill="#f87171" rx="2" />
    </g>
    {[
      { x: 148, y: 170, color: '#bbf7d0', label: 'H' },
      { x: 196, y: 158, color: '#bfdbfe', label: 'N' },
      { x: 360, y: 165, color: '#fde68a', label: 'A' },
      { x: 408, y: 172, color: '#fecaca', label: 'R' },
    ].map(({ x, y, color, label }) => (
      <g key={label}>
        <circle cx={x} cy={y} r="18" fill={color} />
        <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="600" fill="#374151">{label}</text>
      </g>
    ))}
    <g transform="translate(258, 130)">
      <rect x="0" y="0" width="84" height="32" fill="white" rx="8" opacity="0.95" />
      <rect x="8" y="8" width="10" height="10" fill="#25D366" rx="2" />
      <rect x="24" y="10" width="40" height="6" fill="#d1d5db" rx="3" />
      <rect x="24" y="18" width="28" height="4" fill="#e5e7eb" rx="2" />
    </g>
    <text x="200" y="100" fontSize="16" opacity="0.3" fill="#6366f1">✦</text>
    <text x="420" y="120" fontSize="12" opacity="0.25" fill="#6366f1">✦</text>
  </svg>
);

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        padding: '4rem 0 3rem',
        minHeight: '520px',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: 'var(--accent-light)', color: 'var(--accent-text)',
            padding: '6px 14px', borderRadius: '20px',
            fontSize: '13px', fontWeight: 500, marginBottom: '28px',
            border: '1px solid var(--border)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            Built for KIIT University, Bhubaneswar
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '58px', fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.1, marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            Share cabs.<br />
            <em style={{ color: 'var(--accent)' }}>Split the fare.</em>
          </h1>

          <p style={{
            fontSize: '17px', color: 'var(--text-secondary)',
            lineHeight: 1.75, marginBottom: '40px', maxWidth: '420px',
          }}>
            Find KIIT batchmates heading the same way. Form a group, book one Ola or Uber, and split the cost — all coordinated via WhatsApp.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {user ? (
              <>
                <Link href="/board" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--accent)', color: '#fff',
                  padding: '13px 26px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                }}>
                  <Zap size={17} /> Live board
                </Link>
                <Link href="/groups/search" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-card)', color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  padding: '13px 26px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                }}>
                  Find a group <ArrowRight size={17} />
                </Link>
                <Link href="/groups/create" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-card)', color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  padding: '13px 26px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                }}>
                  Start a group
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--accent)', color: '#fff',
                  padding: '13px 26px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                }}>
                  Get started free <ArrowRight size={17} />
                </Link>
                <Link href="/board" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-card)', color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  padding: '13px 26px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                }}>
                  <Zap size={17} /> View live board
                </Link>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <HeroIllustration />
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0 3rem' }} />

      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '38px', fontWeight: 400,
          color: 'var(--text-primary)', marginBottom: '8px',
          letterSpacing: '-0.02em',
        }}>
          How it works
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Four steps to a shared cab, zero chaos.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
          {[
            { icon: <MapPin size={20} color="var(--accent)" />, step: '01', title: 'Enter your route', desc: 'Tell us where you\'re going and when.' },
            { icon: <Users size={20} color="var(--accent)" />, step: '02', title: 'Find your group', desc: 'We match you with batchmates going the same way.' },
            { icon: <MessageCircle size={20} color="var(--accent)" />, step: '03', title: 'Coordinate on WhatsApp', desc: 'Group details and fare split sent instantly.' },
            { icon: <Smartphone size={20} color="var(--accent)" />, step: '04', title: 'Book one cab', desc: 'Organizer opens Ola or Uber with destination pre-filled.' },
          ].map(({ icon, step, title, desc }) => (
            <div key={step} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '40px', height: '40px', background: 'var(--accent-light)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{step}</span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--accent)', borderRadius: '16px',
          padding: '40px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px', fontWeight: 400,
              color: '#ffffff', marginBottom: '10px',
            }}>
              Holiday season rush? We've got you.
            </h3>
            <p style={{ fontSize: '15px', color: '#bfdbfe', lineHeight: 1.6, maxWidth: '480px' }}>
              Diwali break, semester end, exam season — when every student heads to the airport at the same time, RideSync makes coordination effortless.
            </p>
          </div>
          <Link href={user ? '/board' : '/register'} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#ffffff', color: 'var(--accent)',
            padding: '13px 26px', borderRadius: '10px',
            fontSize: '15px', fontWeight: 700, textDecoration: 'none',
            whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '32px',
          }}>
            {user ? 'View live board' : 'Get started'} <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}