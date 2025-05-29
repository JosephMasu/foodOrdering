import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { Link, Stack } from 'expo-router';
import { supabase } from '@/src/lib/supabase';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Error', error.message);
    } else {
      Alert.alert('Success', 'Logged in successfully!');
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign in' }} />

      <Text style={styles.heading}>Welcome Back</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          style={styles.input}
          secureTextEntry
        />

        <View>
          <Button
            disabled={loading}
            onPress={signInWithEmail}
            text={loading ? 'Logging in...' : 'Login'}
          />
          {loading && <ActivityIndicator style={styles.spinner} color={Colors.light.tint} />}
        </View>

        <Link href="/sign-up" style={styles.textButton}>
          Don't have an account? Create one
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  label: {
    marginBottom: 6,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  spinner: {
    position: 'absolute',
    right: 20,
    top: '30%',
  },
  textButton: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.light.tint,
  },
});

export default SignInScreen;
