// src/types/data.ts

// The main user interface
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Donor' | 'Beneficiary' | 'Partner' | 'Volunteer' | 'Member' | 'User';
  status?: string;
  preferredLanguage?: string;
  membershipExpiry?: string; // ISO string format
}

// Data for a Partner organization, linked to a User
export interface Partner {
  id: number;
  userId: number;
  user: User; // The associated user account
  organizationName: string;
  contactPerson: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  proposals?: Proposal[];
  createdAt: string;
  updatedAt: string;
}

// Data for a Proposal submitted by a Partner
export interface Proposal {
  id: number;
  partnerId: number;
  partner?: Partner;
  title: string;
  description: string;
  requestedAmount?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  updatedAt: string;
}

// Data for an Event
export interface Event {
  id: number;
  title: string;
  description: string;
  locationName: string;
  locationLat: number;
  locationLng: number;
  eventDate: string; // ISO string format
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Data for a Project
export interface Project {
  id: number;
  name: string;
  description: string;
  goal: number;
  raised: number;
  status: 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

// Data for a Donation
export interface Donation {
  id: number;
  amount: number;
  message?: string;
  donorId: number;
  projectId: number;
  createdAt: string;
  updatedAt: string;
  donor?: User;
  project?: Project;
}
