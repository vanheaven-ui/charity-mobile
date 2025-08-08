import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { getProjects } from "../../../src/services/api";
import { Project } from "../../../src/types/data";

const ProjectsScreen = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch all projects from the API
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const allProjects = await getProjects();
      setProjects(allProjects);
      setError(null);
    } catch (e: any) {
      console.error("Error fetching projects:", e);
      setError("Failed to load projects. Please try again later.");
      Alert.alert("Error", "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle navigation to a specific project's details page
  const handleProjectPress = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={projects.length === 0 && styles.centeredContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#fff"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Projects</Text>
        <Text style={styles.headerSubtitle}>
          Explore and contribute to our active projects
        </Text>
      </View>
      {projects.length === 0 ? (
        <Text style={styles.noProjectsText}>No active projects found.</Text>
      ) : (
        projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            style={styles.card}
            onPress={() => handleProjectPress(project.id)}
          >
            <Text style={styles.projectTitle}>{project.name}</Text>
            <Text style={styles.projectDescription} numberOfLines={2}>
              {project.description}
            </Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${
                      (Math.min(project.raised, project.goal) / project.goal) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              ${project.raised} raised of ${project.goal}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
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
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  noProjectsText: {
    color: "#a1a1aa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
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
    textAlign: "center",
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
  projectTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  projectDescription: {
    color: "#a1a1aa",
    fontSize: 14,
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#3f3f46", // zinc-700
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#0ea5e9", // sky-500
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#a1a1aa",
    textAlign: "right",
  },
});

export default ProjectsScreen;
