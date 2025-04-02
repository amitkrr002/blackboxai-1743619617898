import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUp } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const SignupScreen = () => {
  const { signIn: authSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { user, session, error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        await authSignIn(user, session);
        navigation.navigate('Home');
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
        <Text className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</Text>
        
        {error && (
          <View className="bg-red-100 p-3 rounded-md mb-4">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}

        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-6"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-blue-500 rounded-md p-3 items-center"
          onPress={handleSignup}
          disabled={loading}
        >
          <Text className="text-white font-medium">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View className="mt-4">
          <Text className="text-center text-gray-600">
            Already have an account?{' '}
            <Text 
              className="text-blue-500" 
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;