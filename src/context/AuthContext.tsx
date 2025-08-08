import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { getMyProfile } from "../services/api";
import { router } from "expo-router";

// Define the shape of a user object
export interface User {
  id: number;
  email: string;
  name: string;
  role:
    | "Partner"
    | "Admin"
    | "Donor"
    | "Beneficiary"
    | "Volunteer"
    | "Member"
    | "User";
  organizationName?: string;
  preferredLanguage?: string; // New field for preferred language
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from storage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const storedUser = await SecureStore.getItemAsync("user");

        if (storedToken && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to load user from storage", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (token: string, userData: User) => {
    try {
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to save token or user data", error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setUser(null);
      // Redirect to the login page after logout
      router.replace("/login");
    } catch (error) {
      console.error("Failed to remove token or user data", error);
    }
  };

  // Function to update the user object in state and storage
  const updateUser = async (data: Partial<User>) => {
    setUser((prevUser) => {
      if (prevUser) {
        const updatedUser = { ...prevUser, ...data };
        SecureStore.setItemAsync("user", JSON.stringify(updatedUser));
        return updatedUser;
      }
      return prevUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
