import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useAuth } from '../../../src/context/AuthContext';
import { getMyProfile, updateProfile } from '../../../src/services/api';
import { router } from 'expo-router';

// The profile screen will display the user's details and provide a logout button.
export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferredLanguage: user?.preferredLanguage || '',
  });

  // Handle changes to the form fields
  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle saving the updated profile
  const handleSave = async () => {
    setLoading(true);
    try {
      if (!user) return;
      await updateProfile(formData);
      // Update the user context with the new data
      updateUser({
        ...user,
        ...formData,
      });
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout(), style: 'destructive' },
      ],
      { cancelable: false }
    );
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900 p-6">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="text-white mt-4">Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-zinc-900 p-6">
      <View className="my-8">
        <Text className="text-3xl font-bold text-white mb-4">My Profile</Text>
        {!isEditing ? (
          <View className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-sky-500 items-center justify-center mr-4">
                <Text className="text-white text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View>
                <Text className="text-xl font-bold text-white">{user.name}</Text>
                <Text className="text-sm text-zinc-400">{user.email}</Text>
              </View>
            </View>
            <View className="border-t border-zinc-700 pt-4 mt-4">
              <Text className="text-lg text-zinc-300">
                <Text className="font-bold text-white">Role:</Text> {user.role}
              </Text>
              <Text className="text-lg text-zinc-300">
                <Text className="font-bold text-white">Language:</Text> {user.preferredLanguage || 'Not set'}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-sky-600 p-3 rounded-lg mt-6"
              onPress={() => setIsEditing(true)}
            >
              <Text className="text-white text-center font-bold">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-zinc-800 p-6 rounded-lg shadow-lg">
            <Text className="text-2xl font-bold text-white mb-4">Edit Profile</Text>
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-lg mb-3"
              placeholder="Name"
              placeholderTextColor="#a1a1aa"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-lg mb-3"
              placeholder="Email"
              placeholderTextColor="#a1a1aa"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            <TextInput
              className="bg-zinc-700 text-white p-3 rounded-lg mb-3"
              placeholder="Preferred Language"
              placeholderTextColor="#a1a1aa"
              value={formData.preferredLanguage}
              onChangeText={(text) => handleChange('preferredLanguage', text)}
            />
            <TouchableOpacity
              className="bg-green-600 p-3 rounded-lg mt-4"
              onPress={handleSave}
              disabled={loading}
            >
              <Text className="text-white text-center font-bold">{loading ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-zinc-700 p-3 rounded-lg mt-2"
              onPress={() => setIsEditing(false)}
            >
              <Text className="text-white text-center font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          className="bg-red-600 p-3 rounded-lg mt-6"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-bold">Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
