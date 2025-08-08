import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { User, Partner, Proposal, Project, Event } from "../types/data"; // Assuming you've moved your types to a central file

// Fallback interfaces if types are not in a separate file
// interface User {
//   id: number;
//   email: string;
//   name: string;
//   role: 'Partner' | 'Admin' | 'Donor' | 'Beneficiary' | 'Volunteer' | 'Member' | 'User';
//   organizationName?: string;
//   preferredLanguage?: string;
// }

// interface Partner {
//   id: number;
//   userId: number;
//   organizationName: string;
//   contactPerson: string;
//   contactEmail: string;
//   phone?: string;
//   address?: string;
//   website?: string;
//   description?: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Proposal {
//   id: number;
//   partnerId: number;
//   partner?: Partner;
//   title: string;
//   description: string;
//   requestedAmount?: number;
//   status: 'Pending' | 'Approved' | 'Rejected';
//   submittedAt: string;
//   updatedAt: string;
// }

// interface Project {
//   id: number;
//   name: string;
//   description: string;
//   goal: number;
//   raised: number;
//   status: string;
// }

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
// This function handles the login API call, not the context login
export const loginUser = async (loginData: {
  email: string;
  password: string;
}): Promise<{ token: string; user: User }> => {
  const response = await api.post<{ token: string; user: User }>(
    "/users/login",
    loginData
  );
  return response.data;
};

export const registerUser = async (
  userData: Partial<User>
): Promise<{ token: string; user: User }> => {
  const response = await api.post<{ token: string; user: User }>(
    "/users/register",
    userData
  );
  return response.data;
};

// User Profile Service
export const getMyProfile = async (): Promise<User> => {
  const response = await api.get<User>("/users/profile");
  return response.data;
};

export const updateProfile = async (
  profileData: Partial<User>
): Promise<User> => {
  const response = await api.put<User>("/users/profile", profileData);
  return response.data;
};

// Partner Service
export const getAllPartners = async (): Promise<Partner[]> => {
  const response = await api.get<Partner[]>("/partners");
  return response.data;
};

// Proposal Service
export const getAllProposals = async (): Promise<Proposal[]> => {
  const response = await api.get<Proposal[]>("/partners/admin/proposals");
  return response.data;
};

export const getMyProposals = async (): Promise<Proposal[]> => {
  const response = await api.get<Proposal[]>("/partners/proposals/me");
  return response.data;
};

export const createProposal = async (
  proposalData: Partial<Proposal>
): Promise<Proposal> => {
  const response = await api.post<Proposal>(
    "/partners/proposals",
    proposalData
  );
  return response.data;
};

export const getProposalById = async (
  id: number | string
): Promise<Proposal> => {
  const response = await api.get<Proposal>(`/partners/proposals/${id}`);
  return response.data;
};

export const updateProposal = async (
  id: number | string,
  data: Partial<Proposal>
): Promise<Proposal> => {
  const response = await api.put<Proposal>(
    `/partners/admin/proposals/${id}`,
    data
  );
  return response.data;
};

// Event Service
export const getAllEvents = async (): Promise<any[]> => {
  // Using 'any' for simplicity, should be a specific type
  const response = await api.get<any[]>("/events");
  return response.data;
};

// Fetches a single event by its ID
export const getEventById = async (id: number | string): Promise<Event> => {
  const response = await api.get<Event>(`/events/${id}`);
  return response.data;
};

export const signUpForEvent = async (eventId: number): Promise<any> => {
  const response = await api.post(`/events/${eventId}/signup`);
  return response.data;
};

export const getSignedUpEvents = async (): Promise<any[]> => {
  const response = await api.get<any[]>("/events/signed-up-events");
  return response.data;
};

// Project Service
export const getProjects = async (search?: string): Promise<any[]> => {
  const response = await api.get<any[]>("/projects", { params: { search } });
  return response.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
};

export const donateToProject = async (
  projectId: number,
  amount: number,
  message: string
): Promise<any> => {
  // You would typically get the donorId from a user authentication context
  const donationData = {
    amount,
    message,
    projectId,
  };

  const response = await api.post(`/donations`, donationData);
  return response.data;
};
