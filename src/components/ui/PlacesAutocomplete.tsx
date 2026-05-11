'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  placeholder?: string;
}

export default function PlacesAutocomplete({ value, onChange, placeholder }: PlacesAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<any>(null);

  const search = async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&countrycodes=in&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      setSuggestions(data);
      setShowDropdown(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const handleSelect = (s: Suggestion) => {
    const parts = s.display_name.split(',');
    const shortName = parts.slice(0, 3).join(',').trim();
    setQuery(shortName);
    onChange(shortName, parseFloat(s.lat), parseFloat(s.lon));
    setSuggestions([]);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClick = () => setShowDropdown(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
      <div style={{
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
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => { setFocused(true); if (suggestions.length > 0) setShowDropdown(true); }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder || 'Search location...'}
          style={{
            flex: 1, padding: '12px 0',
            border: 'none', background: 'transparent',
            fontSize: '15px', color: 'var(--text-primary)', outline: 'none',
          }}
        />
        {loading && (
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 0.6s linear infinite', flexShrink: 0 }} />
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '10px', zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => handleSelect(s)}
              style={{
                padding: '12px 14px', cursor: 'pointer',
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <MapPin size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {s.display_name.split(',')[0]}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {s.display_name.split(',').slice(1, 4).join(',').trim()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}