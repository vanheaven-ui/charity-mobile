import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import { getEventById, signUpForEvent } from "../../../src/services/api";
import { Event } from "../../../src/types/data";

const EventDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth(); // Assuming useAuth provides a user object
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const isAuth = !!user;

  // Function to fetch a single event by its ID
  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      if (id && typeof id === "string") {
        const eventData = await getEventById(id);
        // Ensure the returned data matches the 'Event' type before setting state
        setEvent(eventData);
      } else {
        Alert.alert("Error", "Invalid event ID.");
        router.back();
      }
    } catch (e: any) {
      console.error("Failed to fetch event details:", e);
      Alert.alert("Error", "Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  // Handler for signing up for an event
  const handleSignUp = async () => {
    if (!isAuth || !event) {
      Alert.alert(
        "Login Required",
        "You must be logged in to sign up for an event."
      );
      return;
    }

    setIsSigningUp(true);
    try {
      await signUpForEvent(event.id);
      Alert.alert("Success", "You have successfully signed up for this event!");
      // You might want to refresh the event details here to show updated signup counts, etc.
    } catch (e: any) {
      console.error("Failed to sign up for event:", e);
      Alert.alert(
        "Error",
        e.response?.data?.error || "Failed to sign up for the event."
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Event not found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{event.title}</Text>
          {event.eventDate && (
            <Text style={styles.detailText}>
              <Text style={styles.label}>Date:</Text>{" "}
              {new Date(event.eventDate).toLocaleString()}
            </Text>
          )}
          <Text style={styles.detailText}>
            <Text style={styles.label}>Location:</Text> {event.locationName}
          </Text>
          <Text style={styles.descriptionText}>
            <Text style={styles.label}>Description:</Text> {event.description}
          </Text>

          {isAuth && (
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={isSigningUp}
            >
              <Text style={styles.signUpButtonText}>
                {isSigningUp ? "Signing Up..." : "Sign Up for this Event"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#27272a", // zinc-800
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
    color: "#fff",
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: "#a1a1aa", // zinc-400
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#e4e4e7", // zinc-200
  },
  descriptionText: {
    fontSize: 16,
    color: "#a1a1aa",
    lineHeight: 24,
    marginTop: 12,
  },
  signUpButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#10b981", // green-500
    borderRadius: 8,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#6b7280", // gray-500
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
    color: "#ef4444", // red-500
  },
});

export default EventDetailsScreen;
