import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../../src/context/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();

  // If the user object is not available, we can't determine the role.
  // In a real scenario, this might show a loading screen or redirect.
  // For this app, we'll assume the AuthProvider handles this gracefully.
  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0ea5e9", // sky-500
        tabBarStyle: {
          backgroundColor: "#18181b", // zinc-900
          borderTopColor: "#3f3f46", // zinc-700
        },
        headerStyle: {
          backgroundColor: "#18181b",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />
      {user.role === "Admin" && (
        <Tabs.Screen
          name="admin"
          options={{
            title: "Admin",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="shield-crown"
                size={24}
                color={color}
              />
            ),
          }}
        />
      )}
      {user.role === "Partner" && (
        <Tabs.Screen
          name="proposals"
          options={{
            title: "Proposals",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="file-document"
                size={24}
                color={color}
              />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
