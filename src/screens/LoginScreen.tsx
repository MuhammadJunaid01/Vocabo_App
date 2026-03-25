import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAuth } from '../features/auth/hooks';
import { Button } from '../shared/components/Button';
import { Input } from '../shared/components/Input';


export const LoginScreen: React.FC = () => {
  const { login, register, googleLogin, loading, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    clearError();
    const authFn = isLogin ? login : register;
    authFn(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
        
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button
          title={isLogin ? 'Sign In' : 'Create Account'}
          onPress={handleSubmit}
          loading={loading}
        />

        <Button
          title="Sign in with Google"
          variant="secondary"
          onPress={googleLogin}
          loading={loading}
        />

        <Button
          title={isLogin ? 'Need an account?' : 'Have an account?'}
          variant="secondary"
          onPress={() => setIsLogin(!isLogin)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
});