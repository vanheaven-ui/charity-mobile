import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../../src/context/AuthContext";
import { getProposalById, updateProposal } from "../../../src/services/api";
import { Proposal } from "../../../src/types/data";
import { router, useLocalSearchParams } from "expo-router";

// Define the specific types for proposal statuses to be used in the function signature
type ProposalStatus = "Pending" | "Approved" | "Rejected";

export default function ProposalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProposalDetails();
    }
  }, [id]);

  const fetchProposalDetails = async () => {
    setLoading(true);
    try {
      const data = await getProposalById(Number(id));
      setProposal(data);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to fetch proposal details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: ProposalStatus) => {
    if (!proposal) return;
    try {
      await updateProposal(proposal.id, { status });
      Alert.alert("Success", `Proposal status updated to ${status}.`);
      fetchProposalDetails(); // Refresh the data
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update proposal status."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!proposal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Proposal not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{proposal.title}</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Organization:</Text>{" "}
          {proposal.partner?.organizationName || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Status:</Text> {proposal.status}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Requested Amount:</Text> $
          {proposal.requestedAmount?.toLocaleString() || "N/A"}
        </Text>
        <Text style={styles.descriptionText}>
          <Text style={styles.label}>Description:</Text> {proposal.description}
        </Text>

        {user?.role === "Admin" && proposal.status === "Pending" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => handleUpdateStatus("Approved")}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleUpdateStatus("Rejected")}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#111827",
  },
  descriptionText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
    marginTop: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: "#10b981", // green-500
  },
  rejectButton: {
    backgroundColor: "#ef4444", // red-500
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#6b7280",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "#ef4444",
  },
});
