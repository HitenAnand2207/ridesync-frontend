type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  city_district?: string;
  county?: string;
  state_district?: string;
  state?: string;
};

type NominatimResponse = {
  address?: NominatimAddress;
  display_name?: string;
};

export function extractCityFromNominatim(data: NominatimResponse): string {
  const address = data.address;
  const city =
    address?.city ||
    address?.town ||
    address?.village ||
    address?.municipality ||
    address?.city_district ||
    address?.county ||
    address?.state_district ||
    address?.state ||
    '';

  if (city) return city;

  const displayParts = data.display_name
    ?.split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return displayParts?.[0] || '';
}

export async function reverseGeocodeCity(latitude: number, longitude: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: 'jsonv2',
    addressdetails: '1',
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: { 'Accept-Language': 'en' },
  });

  if (!res.ok) return '';

  const data = await res.json();
  return extractCityFromNominatim(data);
}
