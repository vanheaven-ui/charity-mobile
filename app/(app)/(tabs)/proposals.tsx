// app/(app)/(tabs)/proposals.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { getMyProposals } from "../../../src/services/api";
import { router } from "expo-router";

interface Proposal {
  id: number;
  title: string;
  status: string;
  submittedAt: string;
}

export default function ProposalsScreen() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && user.role === "Partner") {
      fetchProposals();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProposals = async () => {
    try {
      if (!user || user.role !== "Partner") return;
      const data = await getMyProposals();
      setProposals(data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to fetch proposals."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProposals();
  };

  const renderProposalItem = ({ item }: { item: Proposal }) => (
    <TouchableOpacity
      className="bg-zinc-800 p-4 rounded-lg mb-3 shadow-md"
      onPress={() => router.push(`/proposals/${item.id}`)}
    >
      <Text className="text-xl font-bold text-white">{item.title}</Text>
      <Text className="text-base text-zinc-400 mt-1">
        Status: {item.status}
      </Text>
      <Text className="text-sm text-zinc-500 mt-1">
        Submitted: {new Date(item.submittedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (user?.role !== "Partner") {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
        <Text className="text-white text-2xl font-semibold text-center">
          You must be a registered Partner to view proposals.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-900 p-6">
      <View className="flex-row items-center justify-between mb-6 mt-6">
        <Text className="text-3xl font-bold text-white">My Proposals</Text>
        <TouchableOpacity
          className="bg-sky-500 p-3 rounded-lg"
          onPress={() => router.push("/proposals/create")}
        >
          <Text className="text-white font-bold">New Proposal</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={proposals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProposalItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="mt-10">
            <Text className="text-center text-zinc-400 text-lg">
              You have not submitted any proposals yet.
            </Text>
          </View>
        }
      />
    </View>
  );
}
