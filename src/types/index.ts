export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  status: string;
  share: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

export interface RideGroup {
  id: string;
  organizerId: string;
  origin: string;
  destination: string;
  departureTime: string;
  totalSlots: number;
  availableSlots: number;
  estimatedFare: number;
  status: string;
  description: string | null;
  whatsappLink: string | null;
  olaDeepLink: string | null;
  uberDeepLink: string | null;
  platformFeePaid: boolean;
  organizer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  members: GroupMember[];
  _count?: { members: number };
}

export interface MatchedGroup {
  group: RideGroup;
  score: number;
  reasons: string[];
}

export interface Membership {
  id: string;
  groupId: string;
  userId: string;
  status: string;
  share: number;
  createdAt: string;
  group: RideGroup;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}