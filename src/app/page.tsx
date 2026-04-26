'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

const CityIllustration = () => (
  <svg viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '640px' }}>
    {/* Sky */}
    <rect width="600" height="320" fill="var(--bg-secondary)" rx="16" />
    {/* Sun */}
    <circle cx="480" cy="70" r="36" fill="#fef08a" opacity="0.8" />
    <circle cx="480" cy="70" r="28" fill="#fde047" />
    {/* Sun rays */}
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <line key={i}
        x1={480 + Math.cos(angle * Math.PI / 180) * 34}
        y1={70 + Math.sin(angle * Math.PI / 180) * 34}
        x2={480 + Math.cos(angle * Math.PI / 180) * 46}
        y2={70 + Math.sin(angle * Math.PI / 180) * 46}
        stroke="#fde047" strokeWidth="2.5" strokeLinecap="round"
      />
    ))}
    {/* Clouds */}
    <ellipse cx="120" cy="60" rx="50" ry="22" fill="white" opacity="0.7" />
    <ellipse cx="150" cy="52" rx="35" ry="20" fill="white" opacity="0.7" />
    <ellipse cx="90" cy="58" rx="30" ry="16" fill="white" opacity="0.6" />
    <ellipse cx="320" cy="45" rx="40" ry="18" fill="white" opacity="0.5" />
    <ellipse cx="350" cy="38" rx="28" ry="16" fill="white" opacity="0.5" />
    {/* Road */}
    <rect x="0" y="240" width="600" height="80" fill="#d6d3d1" />
    <rect x="0" y="238" width="600" height="6" fill="#a8a29e" />
    {/* Road markings */}
    {[40, 120, 200, 280, 360, 440, 520].map((x, i) => (
      <rect key={i} x={x} y="272" width="44" height="8" rx="4" fill="white" opacity="0.6" />
    ))}
    {/* Buildings left */}
    <rect x="20" y="140" width="60" height="100" fill="#78716c" rx="4" />
    <rect x="30" y="152" width="14" height="18" fill="#fef08a" opacity="0.6" rx="2" />
    <rect x="52" y="152" width="14" height="18" fill="#fef08a" opacity="0.6" rx="2" />
    <rect x="30" y="182" width="14" height="18" fill="#bfdbfe" opacity="0.5" rx="2" />
    <rect x="52" y="182" width="14" height="18" fill="#fef08a" opacity="0.6" rx="2" />
    {/* Tall building */}
    <rect x="90" y="100" width="50" height="140" fill="#57534e" rx="4" />
    <rect x="98" y="112" width="12" height="14" fill="#bfdbfe" opacity="0.7" rx="2" />
    <rect x="118" y="112" width="12" height="14" fill="#bfdbfe" opacity="0.7" rx="2" />
    <rect x="98" y="136" width="12" height="14" fill="#fef08a" opacity="0.6" rx="2" />
    <rect x="118" y="136" width="12" height="14" fill="#bfdbfe" opacity="0.7" rx="2" />
    <rect x="98" y="160" width="12" height="14" fill="#bfdbfe" opacity="0.7" rx="2" />
    <rect x="118" y="160" width="12" height="14" fill="#fef08a" opacity="0.6" rx="2" />
    <rect x="98" y="184" width="12" height="14" fill="#fef08a" opacity="0.6" rx="2" />
    <rect x="118" y="184" width="12" height="14" fill="#bfdbfe" opacity="0.7" rx="2" />
    {/* Mid buildings */}
    <rect x="155" y="160" width="70" height="80" fill="#a8a29e" rx="4" />
    <rect x="163" y="170" width="16" height="18" fill="#fef08a" opacity="0.7" rx="2" />
    <rect x="187" y="170" width="16" height="18" fill="#bfdbfe" opacity="0.6" rx="2" />
    <rect x="163" y="198" width="16" height="18" fill="#bfdbfe" opacity="0.6" rx="2" />
    <rect x="187" y="198" width="16" height="18" fill="#fef08a" opacity="0.7" rx="2" />
    {/* Trees */}
    <rect x="240" y="210" width="8" height="30" fill="#92400e" />
    <ellipse cx="244" cy="200" rx="22" ry="24" fill="#16a34a" opacity="0.85" />
    <ellipse cx="244" cy="192" rx="16" ry="18" fill="#15803d" opacity="0.9" />
    <rect x="268" y="218" width="6" height="22" fill="#92400e" />
    <ellipse cx="271" cy="208" rx="17" ry="20" fill="#16a34a" opacity="0.8" />
    {/* Car (main hero) */}
    <g transform="translate(310, 205)">
      <rect x="0" y="20" width="120" height="40" fill="#2563eb" rx="6" />
      <rect x="10" y="8" width="100" height="36" fill="#3b82f6" rx="8" />
      <rect x="16" y="12" width="38" height="24" fill="#bfdbfe" opacity="0.9" rx="4" />
      <rect x="62" y="12" width="38" height="24" fill="#bfdbfe" opacity="0.9" rx="4" />
      <circle cx="22" cy="62" r="13" fill="#1c1917" />
      <circle cx="22" cy="62" r="8" fill="#44403c" />
      <circle cx="22" cy="62" r="4" fill="#a8a29e" />
      <circle cx="98" cy="62" r="13" fill="#1c1917" />
      <circle cx="98" cy="62" r="8" fill="#44403c" />
      <circle cx="98" cy="62" r="4" fill="#a8a29e" />
      <rect x="2" y="28" width="8" height="6" fill="#fde047" rx="2" />
      <rect x="110" y="28" width="8" height="6" fill="#f87171" rx="2" />
      <rect x="40" y="22" width="40" height="3" fill="#60a5fa" opacity="0.5" rx="2" />
    </g>
    {/* Small car */}
    <g transform="translate(80, 215)">
      <rect x="0" y="14" width="80" height="28" fill="#dc2626" rx="5" />
      <rect x="8" y="6" width="65" height="24" fill="#ef4444" rx="6" />
      <rect x="12" y="9" width="22" height="15" fill="#fecaca" opacity="0.8" rx="3" />
      <rect x="40" y="9" width="22" height="15" fill="#fecaca" opacity="0.8" rx="3" />
      <circle cx="14" cy="44" r="9" fill="#1c1917" />
      <circle cx="14" cy="44" r="5" fill="#44403c" />
      <circle cx="66" cy="44" r="9" fill="#1c1917" />
      <circle cx="66" cy="44" r="5" fill="#44403c" />
    </g>
    {/* Right buildings */}
    <rect x="480" y="130" width="55" height="110" fill="#78716c" rx="4" />
    <rect x="488" y="142" width="14" height="16" fill="#bfdbfe" opacity="0.7" rx="2" />
    <rect x="510" y="142" width="14" height="16" fill="#fef08a" opacity="0.6" rx="2" />
    <rect x="488" y="168" width="14" height="16" fill="#fef08a" opacity="0.6" rx="2" />
    <rect x="510" y="168" width="14" height="16" fill="#bfdbfe" opacity="0.7" rx="2" />
    <rect x="488" y="194" width="14" height="16" fill="#bfdbfe" opacity="0.7" rx="2" />
    <rect x="545" y="160" width="45" height="80" fill="#a8a29e" rx="4" />
    <rect x="552" y="170" width="12" height="14" fill="#fef08a" opacity="0.7" rx="2" />
    <rect x="570" y="170" width="12" height="14" fill="#bfdbfe" opacity="0.6" rx="2" />
    {/* Location pin */}
    <g transform="translate(355, 168)">
      <circle cx="15" cy="12" r="12" fill="#dc2626" />
      <circle cx="15" cy="12" r="5" fill="white" />
      <polygon points="15,32 8,18 22,18" fill="#dc2626" />
    </g>
    {/* Stars/sparkles */}
    <text x="200" y="100" fontSize="16" opacity="0.4">✦</text>
    <text x="420" y="130" fontSize="12" opacity="0.3">✦</text>
    <text x="520" y="90" fontSize="10" opacity="0.3">✦</text>
  </svg>
);

const MapIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
    <rect width="280" height="200" fill="var(--bg-secondary)" rx="12" />
    <rect x="0" y="90" width="280" height="20" fill="#d6d3d1" opacity="0.5" />
    <rect x="120" y="0" width="20" height="200" fill="#d6d3d1" opacity="0.5" />
    <circle cx="60" cy="80" r="28" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
    <text x="60" y="85" textAnchor="middle" fontSize="11" fill="#15803d" fontWeight="600">KIIT</text>
    <circle cx="210" cy="130" r="22" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
    <text x="210" y="135" textAnchor="middle" fontSize="10" fill="#1d4ed8" fontWeight="600">Airport</text>
    <path d="M82 88 Q140 60 190 118" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="6 4" fill="none" strokeLinecap="round" />
    <circle cx="82" cy="88" r="5" fill="#16a34a" />
    <circle cx="190" cy="118" r="5" fill="#2563eb" />
    <g transform="translate(126, 60)">
      <rect x="-18" y="-12" width="36" height="22" fill="white" rx="4" stroke="#e8e6e1" strokeWidth="1" />
      <text x="0" y="3" textAnchor="middle" fontSize="9" fill="#57534e" fontWeight="500">25 min</text>
      <polygon points="0,12 -5,10 5,10" fill="white" />
    </g>
  </svg>
);



export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
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
            Live at KIIT University, Bhubaneswar
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '62px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}>
            Share rides.<br />
            <em style={{ color: 'var(--accent)' }}>Save money.</em>
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            marginBottom: '40px',
            maxWidth: '420px',
          }}>
            Find or offer rides with fellow KIIT students. Smart route matching, instant booking, zero hassle.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {user ? (
              <>
                <Link href="/rides/search" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--accent)', color: '#fff',
                  padding: '13px 26px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}>
                  Find a ride <ArrowRight size={17} />
                </Link>
                <Link href="/rides/create" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-card)', color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  padding: '13px 26px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                }}>
                  Offer a ride
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
                <Link href="/login" style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--bg-card)', color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  padding: '13px 26px', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600, textDecoration: 'none',
                }}>
                  Login
                </Link>
              </>
            )}
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CityIllustration />
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '1rem 0 3rem' }} />

      {/* Features with illustrations */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '38px', fontWeight: 400,
          color: 'var(--text-primary)', marginBottom: '8px',
          letterSpacing: '-0.02em',
        }}>
          Everything you need
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Built specifically for campus life at KIIT.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Feature card 1 */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '32px', overflow: 'hidden',
          }}>
            <div style={{ marginBottom: '24px' }}>
              <MapIllustration />
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px', fontWeight: 400,
              color: 'var(--text-primary)', marginBottom: '8px',
            }}>
              Smart route matching
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Our scoring engine ranks rides by proximity, time, and seat availability so you always see the best match first.
            </p>
          </div>

         {/* Feature card 2 */}
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '16px', padding: '32px',
                }}>
                  <div style={{ marginBottom: '24px' }}>
                    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
                      <rect width="280" height="200" fill="var(--bg-secondary)" rx="12" />
                      <path d="M140 30 L190 55 L190 110 Q190 150 140 175 Q90 150 90 110 L90 55 Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
                      <path d="M115 105 L132 122 L165 89" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <circle cx="60" cy="60" r="18" fill="#bfdbfe" opacity="0.6" />
                      <circle cx="220" cy="60" r="18" fill="#bfdbfe" opacity="0.6" />
                      <circle cx="60" cy="150" r="18" fill="#bfdbfe" opacity="0.6" />
                      <circle cx="220" cy="150" r="18" fill="#bfdbfe" opacity="0.6" />
                      <line x1="78" y1="65" x2="90" y2="80" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
                      <line x1="202" y1="65" x2="190" y2="80" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
                      <line x1="78" y1="145" x2="90" y2="130" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
                      <line x1="202" y1="145" x2="190" y2="130" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5" />
                    </svg>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px', fontWeight: 400,
                    color: 'var(--text-primary)', marginBottom: '8px',
                  }}>
                    Campus verified
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    Only KIIT students can join. Every account is tied to a university email keeping the community safe and trusted.
                  </p>
                </div>
          {/* Wide feature card */}
          <div style={{
            gridColumn: '1 / -1',
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
                Ready to ride?
              </h3>
              <p style={{ fontSize: '16px', color: '#bfdbfe', lineHeight: 1.6, maxWidth: '420px' }}>
                Join your batchmates who are already saving money on daily commutes, airport trips, and weekend getaways.
              </p>
            </div>
            <Link href={user ? '/rides/search' : '/register'} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#ffffff', color: 'var(--accent)',
              padding: '13px 26px', borderRadius: '10px',
              fontSize: '15px', fontWeight: 700, textDecoration: 'none',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              {user ? 'Find a ride' : 'Get started'} <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}