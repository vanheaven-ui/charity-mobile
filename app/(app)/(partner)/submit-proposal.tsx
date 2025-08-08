import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { createProposal } from "../../../src/services/api";

const SubmitProposalScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !requestedAmount) {
      Alert.alert("Missing Information", "Please fill in all the fields.");
      return;
    }

    setLoading(true);
    try {
      // The API function expects an object with these properties
      const proposalData = {
        title,
        description,
        requestedAmount: parseFloat(requestedAmount),
      };

      await createProposal(proposalData);
      Alert.alert(
        "Success",
        "Your proposal has been submitted successfully for review."
      );
      router.replace("/(partner)/partner"); // Navigate back to the partner dashboard
    } catch (e: any) {
      console.error("Failed to submit proposal:", e);
      Alert.alert(
        "Submission Failed",
        e.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Submit a New Proposal</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Proposal Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Water Sanitation Project"
              placeholderTextColor="#a1a1aa"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the project and its goals..."
              placeholderTextColor="#a1a1aa"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.label}>Requested Amount ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 50000"
              placeholderTextColor="#a1a1aa"
              value={requestedAmount}
              onChangeText={setRequestedAmount}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Proposal</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181b", // zinc-900
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#27272a", // zinc-800
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    color: "#a1a1aa",
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: "#3f3f46", // zinc-700
    color: "#fff",
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: "#0ea5e9", // sky-500
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SubmitProposalScreen;
