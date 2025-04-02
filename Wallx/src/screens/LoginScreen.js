import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn } from '../services/auth';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { signIn: authSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const navigation = useNavigation();

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleLogin = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setFormError(null);
    
    try {
      const { user, session, error } = await signIn(email, password);
      if (error) {
        setFormError(error.message);
      } else if (user && session) {
        await authSignIn(user, session);
        navigation.navigate('Home');
      }
    } catch (err) {
      setFormError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f3f4f6', justifyContent: 'center', padding: 32}}>
      <View style={{backgroundColor: 'white', borderRadius: 12, padding: 32, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4}}>
        <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#1f2937'}}>
          Welcome Back
        </Text>
        
        {formError && (
          <View style={{backgroundColor: '#fee2e2', padding: 12, borderRadius: 6, marginBottom: 16}}>
            <Text style={{color: '#b91c1c', textAlign: 'center'}}>{formError}</Text>
          </View>
        )}

        <View>
          {errors.email && (
            <Text style={{color: '#ef4444', fontSize: 12, marginBottom: 4}}>{errors.email}</Text>
          )}
          <TextInput
            style={{borderWidth: 1, borderColor: '#d1d5db', borderRadius: 6, padding: 12, marginBottom: 16}}
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors(prev => ({...prev, email: ''}));
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          {errors.password && (
            <Text style={{color: '#ef4444', fontSize: 12, marginBottom: 4}}>{errors.password}</Text>
          )}
          <TextInput
            style={{borderWidth: 1, borderColor: '#d1d5db', borderRadius: 6, padding: 12, marginBottom: 24}}
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors(prev => ({...prev, password: ''}));
              }
            }}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={{backgroundColor: '#3b82f6', borderRadius: 6, padding: 12, alignItems: 'center'}}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{color: 'white', fontWeight: '500'}}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 16}}>
          <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
            <Text style={{color: '#3b82f6'}}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{color: '#3b82f6'}}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;