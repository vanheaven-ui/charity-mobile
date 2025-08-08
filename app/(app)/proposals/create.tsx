// app/(app)/proposals/create.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { createProposal } from "../../../src/services/api";
import { router } from "expo-router";

export default function CreateProposalScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Title and description are required.");
      return;
    }

    setLoading(true);
    try {
      await createProposal({
        title,
        description,
        requestedAmount: requestedAmount
          ? parseInt(requestedAmount)
          : undefined,
      });
      Alert.alert("Success", "Proposal submitted successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to submit proposal."
      );
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "Partner") {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
        <Text className="text-white text-2xl font-semibold text-center">
          Only partners can submit proposals.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-sky-500 p-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-zinc-900 p-6">
      <View className="mt-12">
        <Text className="text-4xl font-bold text-white mb-8">New Proposal</Text>
        <TextInput
          className="w-full bg-zinc-800 text-white rounded-lg p-4 mb-4 text-lg"
          placeholder="Proposal Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="w-full bg-zinc-800 text-white rounded-lg p-4 mb-4 text-lg h-32"
          placeholder="Detailed Description"
          placeholderTextColor="#888"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          className="w-full bg-zinc-800 text-white rounded-lg p-4 mb-6 text-lg"
          placeholder="Requested Amount (Optional)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={requestedAmount}
          onChangeText={setRequestedAmount}
        />
        <TouchableOpacity
          className="w-full bg-sky-500 rounded-lg p-4 items-center mb-4"
          onPress={handleCreate}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">
            {loading ? "Submitting..." : "Submit Proposal"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full bg-zinc-700 rounded-lg p-4 items-center"
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text className="text-white text-lg font-bold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
