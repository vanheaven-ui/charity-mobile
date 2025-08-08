import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import { getMyProposals } from "../../../src/services/api";
import { Proposal } from "../../../src/types/data";

const PartnerScreen = () => {
  const { user } = useAuth(); // Assuming useAuth provides the user object
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      if (!user || user.role !== "Partner") {
        // Handle case where user is not a partner or not authenticated
        Alert.alert(
          "Access Denied",
          "You must be a partner to view this page."
        );
        router.replace("/login");
        return;
      }
      const myProposals = await getMyProposals();
      setProposals(myProposals);
    } catch (e) {
      console.error("Failed to fetch proposals:", e);
      Alert.alert("Error", "Failed to load your proposals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user]);

  const renderProposalItem = ({ item }: { item: Proposal }) => (
    <View style={styles.proposalCard}>
      <Text style={styles.proposalTitle}>{item.title}</Text>
      <Text style={styles.proposalStatus}>Status: {item.status}</Text>
      <Text style={styles.proposalDate}>
        Submitted: {new Date(item.submittedAt).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => router.push(`/(partner)/proposals/${item.id}`)}
      >
        <Text style={styles.viewButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>My Proposals</Text>
      <TouchableOpacity
        style={styles.newProposalButton}
        onPress={() => router.push("/(partner)/submit-proposal")}
      >
        <Text style={styles.newProposalButtonText}>Submit New Proposal</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0ea5e9"
          style={styles.loadingIndicator}
        />
      ) : proposals.length === 0 ? (
        <Text style={styles.noProposalsText}>
          You have not submitted any proposals yet.
        </Text>
      ) : (
        <FlatList
          data={proposals}
          renderItem={renderProposalItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b", // zinc-900
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  newProposalButton: {
    backgroundColor: "#0ea5e9",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  newProposalButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingIndicator: {
    marginTop: 50,
  },
  noProposalsText: {
    color: "#a1a1aa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  proposalCard: {
    backgroundColor: "#27272a", // zinc-800
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderLeftColor: "#0ea5e9",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proposalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  proposalStatus: {
    fontSize: 14,
    color: "#a1a1aa",
    marginBottom: 2,
  },
  proposalDate: {
    fontSize: 12,
    color: "#71717a", // zinc-500
    marginBottom: 8,
  },
  viewButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#3f3f46", // zinc-700
    borderRadius: 6,
    alignItems: "center",
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default PartnerScreen;
