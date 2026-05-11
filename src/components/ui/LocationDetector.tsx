'use client';

import { useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';

interface LocationDetectorProps {
  onCityDetected: (city: string) => void;
}

export default function LocationDetector({ onCityDetected }: LocationDetectorProps) {
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('userCity');
    if (saved) {
      setCity(saved);
      onCityDetected(saved);
      setDismissed(true);
    }
  }, []);

  const detectLocation = async () => {
    setLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.results?.length > 0) {
        const components = data.results[0].address_components;
        const cityComponent = components.find((c: any) =>
          c.types.includes('locality') || c.types.includes('administrative_area_level_2')
        );
        if (cityComponent) {
          setCity(cityComponent.long_name);
          onCityDetected(cityComponent.long_name);
        }
      }
    } catch {
      toast.error('Could not detect location');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (city) {
      localStorage.setItem('userCity', city);
      setDismissed(true);
    }
  };

  if (dismissed) return null;

  return (
    <div style={{
      background: 'var(--accent-light)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '14px 18px', marginBottom: '24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MapPin size={16} color="var(--accent)" />
        {city ? (
          <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
            Detected: <strong>{city}</strong>
          </span>
        ) : (
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Detect your city for better matches
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {city ? (
          <button onClick={handleSave} style={{
            padding: '6px 14px', background: 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}>
            Use {city}
          </button>
        ) : (
          <button onClick={detectLocation} disabled={loading} style={{
            padding: '6px 14px', background: 'var(--accent)',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Detecting...' : 'Detect location'}
          </button>
        )}
        <button onClick={() => setDismissed(true)} style={{
          padding: '6px', background: 'none', border: 'none',
          cursor: 'pointer', color: 'var(--text-muted)',
        }}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

import toast from 'react-hot-toast';