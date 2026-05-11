'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  placeholder?: string;
}

export default function PlacesAutocomplete({ value, onChange, placeholder }: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!inputRef.current || typeof window === 'undefined') return;
    const interval = setInterval(() => {
      if ((window as any).google?.maps?.places) {
        clearInterval(interval);
        autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'in' },
          fields: ['geometry', 'formatted_address', 'name'],
        });
        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            const name = place.name || place.formatted_address || '';
            onChange(name, lat, lng);
          }
        });
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'relative',
      borderRadius: '10px',
      border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border-input)'}`,
      background: 'var(--bg-card)',
      boxShadow: focused ? '0 0 0 3px var(--accent-light)' : 'none',
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '0 14px',
      transition: 'border-color 0.15s, box-shadow 0.15s',
    }}>
      <MapPin size={16} color={focused ? 'var(--accent)' : 'var(--text-muted)'} />
      <input
        ref={inputRef}
        type="text"
        defaultValue={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search location...'}
        style={{
          flex: 1, padding: '12px 0',
          border: 'none', background: 'transparent',
          fontSize: '15px', color: 'var(--text-primary)',
          outline: 'none',
        }}
      />
    </div>
  );
}