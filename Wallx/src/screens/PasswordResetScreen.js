import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { resetPassword } from '../services/auth';

const PasswordResetScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center p-8">
      <View className="bg-white rounded-xl p-8 shadow-md">
        <Text className="text-2xl font-bold text-center mb-6 text-gray-800">Reset Password</Text>
        
        {error && (
          <View className="bg-red-100 p-3 rounded-md mb-4">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}

        {success ? (
          <View className="bg-green-100 p-3 rounded-md mb-4">
            <Text className="text-green-700 text-center">
              Password reset link sent to your email!
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-gray-600 mb-4">
              Enter your email and we'll send you a link to reset your password.
            </Text>

            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-6"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              className="bg-blue-500 rounded-md p-3 items-center"
              onPress={handleReset}
              disabled={loading}
            >
              <Text className="text-white font-medium">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View className="mt-4">
          <Text 
            className="text-blue-500 text-center" 
            onPress={() => navigation.goBack()}
          >
            Back to Login
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PasswordResetScreen;