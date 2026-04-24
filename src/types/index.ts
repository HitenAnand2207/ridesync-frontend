export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface Ride {
  id: string;
  driverId: string;
  origin: string;
  destination: string;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  pricePerSeat: number;
  status: string;
  description: string | null;
  driver: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  _count?: {
    bookings: number;
  };
}

export interface Booking {
  id: string;
  rideId: string;
  userId: string;
  seats: number;
  status: string;
  createdAt: string;
  ride: Ride;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface MatchedRide {
  ride: Ride;
  score: number;
  reasons: string[];
}