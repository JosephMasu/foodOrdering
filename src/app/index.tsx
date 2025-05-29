import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';
import Button from '../components/Button';
import { Link, Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import Colors from '../constants/Colors';

const IndexScreen = () => {
  const { session, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  if (!isAdmin) {
    return <Redirect href="/(user)" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome 👋</Text>
        <Text style={styles.subtext}>{session.user.email}</Text>

        <Link href="/(user)" asChild>
          <Button text="User View" />
        </Link>

        <Link href="/(admin)" asChild>
          <Button text="Admin Panel" />
        </Link>

        <Button
          text="Sign Out"
          onPress={() => supabase.auth.signOut()}
          style={styles.signOutButton}
        />
      </View>
    </View>
  );
};

export default IndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef1f5',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffffcc', 
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    backdropFilter: 'blur(10px)', 
    alignItems: 'stretch',
    gap: 16,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    marginBottom: 4,
  },
  subtext: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#f44336', 
  },

});
