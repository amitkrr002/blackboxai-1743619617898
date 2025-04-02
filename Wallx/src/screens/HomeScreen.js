import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 bg-gray-100 p-8">
      <View className="bg-white rounded-xl p-8 shadow-md">
        <Text className="text-2xl font-bold mb-4">Welcome, {user?.email}!</Text>
        <Text className="text-gray-600 mb-6">
          You are now authenticated and can access all features.
        </Text>
        
        <TouchableOpacity
          className="bg-red-500 rounded-md p-3 items-center"
          onPress={signOut}
        >
          <Text className="text-white font-medium">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;