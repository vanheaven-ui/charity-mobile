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
import { getAllEvents } from "../../../src/services/api";
import { Event } from "../../../src/types/data";

const EventsScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch all events from the API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await getAllEvents();
      setEvents(allEvents);
    } catch (e: any) {
      console.error("Failed to fetch events:", e);
      Alert.alert("Error", "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Renders a single event item in the list
  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => router.push(`/(tabs)/events/${item.id}`)}
    >
      <Text style={styles.eventTitle}>{item.title}</Text>
      {item.eventDate && (
        <Text style={styles.eventDate}>
          {new Date(item.eventDate).toLocaleDateString()} at{" "}
          {new Date(item.eventDate).toLocaleTimeString()}
        </Text>
      )}
      <Text style={styles.eventLocation}>{item.locationName}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Upcoming Events</Text>

      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.noEventsText}>No upcoming events found.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
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
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  noEventsText: {
    color: "#a1a1aa", // zinc-400
    fontSize: 16,
    textAlign: "center",
  },
  eventCard: {
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
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: "#a1a1aa",
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: "#71717a", // zinc-500
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default EventsScreen;
