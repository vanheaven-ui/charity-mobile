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
import { getAllProposals, updateProposal } from "../../../src/services/api";
import { Proposal } from "../../../src/types/data";

// Define the specific types for proposal statuses to be used in the function signature
type ProposalStatus = "Pending" | "Approved" | "Rejected";

export default function AdminScreen() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role === "Admin") {
      fetchProposals();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      if (!user || user.role !== "Admin") return;
      // The getAllProposals function returns an array of the Proposal type defined in ../types/data.ts,
      // which includes the partner object.
      const data = await getAllProposals();
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

  const handleUpdateStatus = async (id: number, status: ProposalStatus) => {
    try {
      await updateProposal(id, { status });
      Alert.alert("Success", `Proposal status updated to ${status}.`);
      fetchProposals(); // Refresh the list
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update proposal status."
      );
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProposals();
  };

  const renderProposalItem = ({ item }: { item: Proposal }) => (
    <TouchableOpacity
      className="bg-zinc-800 p-4 rounded-lg mb-3 shadow-md"
      onPress={() => console.log(`Navigate to proposal ${item.id}`)}
    >
      <Text className="text-xl font-bold text-white">{item.title}</Text>
      <Text className="text-base text-zinc-400 mt-1">
        Organization: {item.partner?.organizationName}
      </Text>
      <Text className="text-base text-zinc-400">Status: {item.status}</Text>
      <Text className="text-sm text-zinc-500 mt-1">
        Submitted: {new Date(item.submittedAt).toLocaleDateString()}
      </Text>
      {item.status === "Pending" && (
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity
            className="flex-1 bg-green-600 p-3 rounded-lg mr-2"
            onPress={() => handleUpdateStatus(item.id, "Approved")}
          >
            <Text className="text-white text-center font-bold">Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-red-600 p-3 rounded-lg ml-2"
            onPress={() => handleUpdateStatus(item.id, "Rejected")}
          >
            <Text className="text-white text-center font-bold">Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (user?.role !== "Admin") {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
        <Text className="text-white text-2xl font-semibold text-center">
          You must be an Admin to access this page.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-900 p-6">
      <Text className="text-3xl font-bold text-white mb-6 mt-6">
        Admin Dashboard
      </Text>
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
              No proposals have been submitted yet.
            </Text>
          </View>
        }
      />
    </View>
  );
}
