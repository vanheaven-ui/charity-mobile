import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { Link } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    // In a real app, you would make an API call here.
    // For now, we'll simulate a successful login with a dummy token.
    console.log("Simulating login...");
    login("dummy-token-123");
  };

  return (
    <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
      <Text className="text-4xl font-bold text-white mb-8">Login</Text>
      <TextInput
        className="w-full bg-zinc-800 text-white rounded-lg p-4 mb-4 text-lg"
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full bg-zinc-800 text-white rounded-lg p-4 mb-6 text-lg"
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="w-full bg-sky-500 rounded-lg p-4 items-center mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-bold">Sign In</Text>
      </TouchableOpacity>
      <Link href="/register" asChild>
        <TouchableOpacity>
          <Text className="text-sky-400 text-base">
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
