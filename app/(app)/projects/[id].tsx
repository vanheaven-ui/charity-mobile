import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { getProjectById, donateToProject } from "../../../src/services/api";
import { Project } from "../../../src/types/data";

const ProjectDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const projectId = typeof id === "string" ? parseInt(id, 10) : undefined;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [isDonating, setIsDonating] = useState(false);

  // Function to fetch the project details
  const fetchProjectDetails = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
    } catch (e: any) {
      console.error("Error fetching project details:", e);
      Alert.alert("Error", "Failed to load project details.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  // Handle the donation submission
  const handleDonation = async () => {
    if (!donationAmount || !projectId) {
      Alert.alert("Donation Error", "Please enter a valid amount.");
      return;
    }

    const amount = parseInt(donationAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Donation Error", "Please enter a valid amount.");
      return;
    }

    setIsDonating(true);
    try {
      await donateToProject(projectId, amount, donationMessage);
      Alert.alert(
        "Success",
        `Thank you for your generous donation of $${amount}!`
      );

      // Navigate back and potentially refresh the projects list
      router.replace("(tabs)/projects");
    } catch (e: any) {
      console.error("Donation failed:", e);
      Alert.alert(
        "Donation Failed",
        e.response?.data?.error || "An error occurred during donation."
      );
    } finally {
      setIsDonating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading project details...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Project not found.</Text>
      </View>
    );
  }

  const progressPercentage =
    (Math.min(project.raised, project.goal) / project.goal) * 100;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{project.name}</Text>
          <Text style={styles.headerSubtitle}>Status: {project.status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Project Description</Text>
          <Text style={styles.cardText}>{project.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Funding Progress</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            ${project.raised} raised of ${project.goal}
          </Text>
        </View>

        <View style={styles.donationForm}>
          <Text style={styles.formTitle}>Make a Donation</Text>
          <TextInput
            style={styles.input}
            placeholder="Donation Amount"
            placeholderTextColor="#a1a1aa"
            keyboardType="numeric"
            value={donationAmount}
            onChangeText={setDonationAmount}
          />
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Leave an optional message"
            placeholderTextColor="#a1a1aa"
            value={donationMessage}
            onChangeText={setDonationMessage}
            multiline
          />
          <TouchableOpacity
            style={styles.donateButton}
            onPress={handleDonation}
            disabled={isDonating || !donationAmount}
          >
            {isDonating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.donateButtonText}>Donate Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b", // zinc-900
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18181b",
  },
  loadingText: {
    marginTop: 10,
    color: "#a1a1aa", // zinc-400
  },
  errorText: {
    color: "#ef4444", // red-500
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#a1a1aa",
  },
  card: {
    backgroundColor: "#27272a", // zinc-800
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#a1a1aa",
    lineHeight: 24,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#3f3f46", // zinc-700
    borderRadius: 6,
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0ea5e9", // sky-500
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: "#a1a1aa",
    textAlign: "right",
  },
  donationForm: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#27272a",
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#3f3f46",
    color: "#fff",
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  donateButton: {
    backgroundColor: "#0ea5e9",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  donateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProjectDetailsScreen;
