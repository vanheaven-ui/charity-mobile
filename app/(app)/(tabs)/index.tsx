// app/(app)/(tabs)/index.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../../src/context/AuthContext";

export default function DashboardScreen() {
  const { logout, user } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
      <Text className="text-white text-3xl font-bold mb-4">
        Hello, {user?.name}!
      </Text>
      <Text className="text-zinc-400 text-lg text-center mb-8">
        Welcome to your {user?.role} dashboard.
      </Text>
      <TouchableOpacity
        className="w-full bg-red-600 rounded-lg p-4 items-center"
        onPress={logout}
      >
        <Text className="text-white text-lg font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
